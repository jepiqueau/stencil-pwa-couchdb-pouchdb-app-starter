import { flush, render } from '@stencil/core/testing';
import { AppAuth } from './app-auth';
import { Session, PDBOptions, Credentials } from '../../global/interfaces';
import { POUCHDB_NAME, SERVER_ADDRESS } from '../../global/constants';
import AppSessionMock from '../../../__mocks__/app-session';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';

var PouchDB = require('pouchDB-memory');
var fetchMock = require('jest-fetch-mock');

describe('app-auth', () => {

    describe('app-auth instance', async () => {
        let instance: any;
        let appSession: any;
        let appPouchDB: any;
        let options: PDBOptions;
        let session: Session;
        beforeEach(async () => {
            instance = new AppAuth();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            let mocks:any = {sessionProvider: appSession, pouchDBProvider:appPouchDB};
            instance.initMocks(mocks);
            options = {
                pouchDB: PouchDB,
                adapter: 'memory'
            };
            session = {
                user_id: 'joesmith',
                token: 'gtKeORg_Slukgc4I5drTpQ',
                password: 'ckD64AN4QGWCVUgvZjlmCA',
                roles: ['user'],
                issued: Date.now() - 10000,
                expires: Date.now() + 1500000,
                provider: "local",
                ip: "::1",
                userDBs: {
                    jpqtest: "http://gtKeORg_Slukgc4I5drTpQ:ckD64AN4QGWCVUgvZjlmCA@localhost:5984/jpqtest"
                }            
            };
        });
        afterEach(async () => {
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appSession.resetMock();
            appPouchDB.resetMock();
        });
        it('should build', () => {
            expect(instance).toBeTruthy();
        });

        it('should attach an AppSession', async () => {
            expect(instance).toBeTruthy();
            let retSession = await appSession.getCurrentSession();
            expect(JSON.stringify(retSession)).toBeNull;       
        });
        it('should set a Session data to local storage', async () => {
            session.issued = 1517680659920;
            session.expires = 1517767059920;
            appSession.saveSessionData(session);
            let retSession: Session = await appSession.getSessionData();
            expect(retSession.user_id).toEqual('joesmith');
            expect(retSession.token).toEqual('gtKeORg_Slukgc4I5drTpQ');
            expect(retSession.password).toEqual('ckD64AN4QGWCVUgvZjlmCA');
            expect(retSession.roles[0]).toEqual('user');
            expect(retSession.issued).toEqual(1517680659920);
            expect(retSession.expires).toEqual(1517767059920);
        });
        it('Should open init "jpqtestdb" in memory', async () => {
            appPouchDB.responseMock({status: 200});
            let res:any = await appPouchDB.initDatabase(POUCHDB_NAME,null,options);
            expect(res.status).toEqual(200);
            let db: any = await appPouchDB.getDB();
            expect(db).toBeDefined();
            expect(db.adapter).toEqual('memory');
            expect(db.name).toEqual('jpqtestdb');
            expect(db.remote).toBeFalsy();
        });
    });
    describe('app-auth reauthenticate', async () => {
        let server: any;
        let instance: any;
        let appSession: any;
        let appPouchDB: any;
        let options: PDBOptions;
        let session: Session;
        let mocks:any;
        beforeEach(async () => {
            instance = new AppAuth();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            mocks= {sessionProvider: appSession, pouchDBProvider:appPouchDB};
            instance.initMocks(mocks);
            options = {
                pouchDB: PouchDB,
                adapter: 'memory'
            };
            session = {
                user_id: 'joesmith',
                token: 'gtKeORg_Slukgc4I5drTpQ',
                password: 'ckD64AN4QGWCVUgvZjlmCA',
                roles: ['user'],
                issued: Date.now() - 10000,
                expires: Date.now() + 1500000,
                provider: "local",
                ip: "::1",
                userDBs: {
                    jpqtest: "http://gtKeORg_Slukgc4I5drTpQ:ckD64AN4QGWCVUgvZjlmCA@localhost:5984/jpqtest"
                }            
            };
            server = {status:200,result:{server:true,dbserver:true}};
        });  
        afterEach(async () => {
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appSession.resetMock();
            appPouchDB.resetMock();
        });
        it('Should return Session not opened', async () => {
            await appSession.removeSessionData();
            await appPouchDB.destroyDatabase();
            let result: any = await instance.reauthenticate(server,options);
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('No session opened');
        });
        it('Should return status 400 when a session is opened and expired and server connected', async () => {
            session.issued = 1517680659920;
            session.expires = 1517767059920;
            appSession.saveSessionData(session);
            let result: any = await instance.reauthenticate(server,options);
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('Session expired');
        });
        it('Should return status 200 when a session is opened and expired and server not connected', async () => {
            server = {status:400,message:"Application Server not connected"};
            session.issued = 1517680659920;
            session.expires = 1517767059920;
            appSession.saveSessionData(session);
            appPouchDB.responseMock({status: 200});
            await appPouchDB.initDatabase(POUCHDB_NAME,null,options);
            let result: any = await instance.reauthenticate(server,options);
            expect(result.status).toEqual(200);
        });
        it('Should return status 200 when a session is opened and not expired and no pouchdb', async () => {
            appPouchDB.responseMock({status: 200});
            session.issued = Date.now() - 10000;
            session.expires = Date.now() + 1500000,
            appSession.saveSessionData(session);
            let result: any = await instance.reauthenticate(server,options);
            expect(result.status).toEqual(200);
        });
        it('Should return status 200 when a pouchDB exists', async () => {
            appPouchDB.responseMock({status: 200});
            let res:any = await appPouchDB.initDatabase(POUCHDB_NAME,null,options);
            expect(res.status).toEqual(200);
            let result: any = await instance.reauthenticate(server,options);
            expect(result.status).toEqual(200);
        });
    });
    describe('app-auth validate username', async () => {
        let headers: Headers;
        let url: string;
        let instance: any;

        beforeEach(() => {
            instance = new AppAuth();
            headers = new Headers();
            headers.append('Content-Type', 'application/json');
            url = SERVER_ADDRESS + 'auth/validate-username/jpq';
        });
        afterEach(() => {
            fetchMock.resetMocks();
            instance = null;
        });
        it('Should return status 409 when a username already exists in CouchDB', async () => {
            let init:any = { "url":url, "status" : 409 ,
                "statusText" : "Conflict" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify({"ok":false}),init);
            try {
                await instance.validateUsername('jpq');              
            } catch (err) {
                expect(err.status).toEqual(409);
                expect(err.message).toEqual('Conflict: Username already in use');
            };
        });
        it('Should return status 200 when a username does not exist in CouchDB', async () => {
            let init:any = { "url":url, "status" : 200 ,
                "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify({"ok":true}),init);
            const result = await instance.validateUsername('paul');
            expect(result.status).toEqual(200);
        });
    });
    describe('app-auth validate email', async () => {
        let headers: Headers;
        let url: string;
        let instance: any;
        beforeEach(() => {
            instance = new AppAuth();
            headers = new Headers();
            headers.append('Content-Type', 'application/json');
            url = SERVER_ADDRESS + 'auth/validate-email/jpq';
        });
        afterEach(() => {
            fetchMock.resetMocks();
            instance = null;
        });
        it('Should return status 409 when an email address already exists in CouchDB', async () => {
            let init:any = { "url":url, "status" : 409 ,
            "statusText" : "Conflict" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify({"ok":false}),init);
            try {
                await instance.validateEmail('jpq@example.com');              
            } catch (err) {
                expect(err.status).toEqual(409);
                expect(err.message).toEqual('Conflict: Email already in use');
            };
        });
        it('Should return status 200 when an email address does not exist in CouchDB', async () => {
            let init:any = { "url":url, "status" : 200 ,
            "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify({"ok":true}),init);
            const result = await instance.validateEmail('paul@example.com');
            expect(result.status).toEqual(200);
        });
    });
    describe('app-auth authenticate', async () => {
        let options: PDBOptions;
        let headers: Headers;
        let url: string;
        let spy: jest.SpyInstance<any>;
        let instance: any;
        let appSession: any;
        let appPouchDB: any;
        let session: Session;
        let mocks:any;
        beforeAll(async () => {
        });   
        beforeEach(async () => {
            instance = new AppAuth();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            mocks = {sessionProvider: appSession, pouchDBProvider:appPouchDB};
            instance.initMocks(mocks);
            headers = new Headers();
            headers.append('Content-Type', 'application/json');
            url = SERVER_ADDRESS + 'auth/login';
            options = {
                pouchDB: PouchDB,
                adapter: 'memory'
            };
            session = {
                user_id: 'joesmith',
                token: 'gtKeORg_Slukgc4I5drTpQ',
                password: 'ckD64AN4QGWCVUgvZjlmCA',
                roles: ['user'],
                issued: Date.now() - 10000,
                expires: Date.now() + 1500000,
                provider: "local",
                ip: "::1",
                userDBs: {
                    jpqtest: "http://gtKeORg_Slukgc4I5drTpQ:ckD64AN4QGWCVUgvZjlmCA@localhost:5984/jpqtest"
                }            
            };
        });
        afterEach(async () => {
            // Unmock.
            spy.mockReset();
            spy.mockRestore();
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appSession.resetMock();
            appPouchDB.resetMock();
            fetchMock.resetMocks();
        });
        it('Should return status 200 when the username and password exist for a user already existing in CouchDB', async () => {
            spy = jest.spyOn(appPouchDB,'initDatabase');
            appPouchDB.responseMock({status: 200});
            let body:any = session;
            let init:any = { "url":url, "status" : 200 ,
            "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let user:Credentials = {username:'jpq',password:'Test12'};
            const result = await instance.authenticate(user,options);
            expect(spy).toHaveBeenCalled();
            expect(result.status).toEqual(200);
            expect(result.result).toEqual(body);
            let db: any = await appPouchDB.getDB();
            expect(db).toBeDefined();
            expect(db._adapter).toEqual('memory');
            expect(db.name).toEqual('jpqtestdb');
            expect(db._remote).toBeFalsy();
        });
        it('Should return status 401 when the username and password do not match an existing user in CouchDB', async () => {
            let body:any = {"status":401, "message":"Unauthorized: Invalid Username or Password"};
            let init:any = { "url":url, "status" : 401 ,
            "statusText" : "Unauthorized" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let user:Credentials = {username:'paul',password:'Test13'};
            const result:any = await instance.authenticate(user,options);              
            expect(result.status).toEqual(401);
            expect(result.message).toEqual('Unauthorized: Invalid Username or Password');
        });
        it('Should return status 400 when the CouchDB Server is not connected', async () => {
            let body:any = {"status":400, "message":"Bad Request"};
            let init:any = { "url":url, "ok":false ,"status" : 400 ,
            "statusText" : "Bad Request" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let user:Credentials = {username:'paul',password:'Test13'};
            const result:any = await instance.authenticate(user,options);              
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('Bad Request');
        });
    });
    describe('app-auth rendering', () => {
        let element: any;
        beforeEach(async () => {
            element = await render({
                components: [AppAuth],
                html: '<app-auth></app-auth>'
            });
        });
        it('should render', async () => {
            await flush(element);
            expect(element).not.toBeNull();
        });
        it('should display an app-session element', async() => {
            await flush(element);
                let sessionEl:any = element.getElementsByTagName('app-session');
            expect(sessionEl).not.toBeNull();
        });
        it('should display an app-pouchdb element', async() => {
            await flush(element);
                let pouchDBEl:any = element.getElementsByTagName('app-pouchdb');
            expect(pouchDBEl).not.toBeNull();
        });
            
    });
});    

