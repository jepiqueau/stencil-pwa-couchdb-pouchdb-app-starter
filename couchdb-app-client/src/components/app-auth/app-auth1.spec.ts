import { AppAuth } from './app-auth';
import { Session, PDBOptions, User } from '../../global/interfaces';
import { SERVER_ADDRESS } from '../../global/constants';
import AppSessionMock from '../../../__mocks__/app-session';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';

var PouchDB = require('pouchDB-memory');
var fetchMock = require('jest-fetch-mock');

describe('app-auth', () => {

    describe('app-auth register', async () => {
        let options: PDBOptions;
        let headers: Headers;
        let url: string;
        let spy: jest.SpyInstance<any>;
        let instance: any;
        let appSession: any;
        let appPouchDB: any;
        let session: Session;
        beforeEach(async () => {
            instance = new AppAuth();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            headers = new Headers();
            headers.append('Content-Type', 'application/json');
            url = SERVER_ADDRESS + 'auth/register';
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
            spy.mockReset();
            spy.mockRestore();
            appSession.resetMock();
            appPouchDB.resetMock();
            fetchMock.resetMocks();
        });
        it('Should return status 200 when the registration in CouchDB is successful', async () => {
            spy = jest.spyOn(appPouchDB,'initDatabase');
            let body:any = session;
            let init:any = { "url":url, "status" : 200 ,
             "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let user:User = {
                name: "Joe Smith",
                username: "joesmith",
                password: "bigsecret",
                confirmPassword: "bigsecret",
                email: "joesmith@example.com"
            };
            appPouchDB.responseMock({status: 200});
            const result:any = await instance.register(user,options);
            expect(spy).toHaveBeenCalled();
            expect(result.status).toEqual(200);
            expect(result.result).toEqual(body);
            let db: any = await appPouchDB.getDB();
            expect(db).toBeDefined();
            expect(db._adapter).toEqual('memory');
            expect(db.name).toEqual('jpqtestdb');
            expect(db._remote).toBeFalsy();
        });
        it('Should return status 400 when the registration in CouchDB failed', async () => {
            let body:any = {"status":400, "message":"Bad Request"};
            let init:any = { "url":url, "status" : 400 ,
             "statusText" : "Bad Request" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let user:User = {'name':'Jean Pierre Queau','username':'jpq',
                    'email':'jpq@example.com','password':'Test12',
                    'confirmPassword':'Test12'};
            const result:any = await instance.register(user,options);              
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('Bad Request');
        });
    });
    describe('app-auth logout', async () => {
        let headers: Headers;
        let url: string;
        let spys: jest.SpyInstance<any>;
        let spy: jest.SpyInstance<any>;
        let instance: any;
        let appSession: any;
        let appPouchDB: any;
        let session: Session;
        beforeAll(async () => {
        });   
        beforeEach (async () => {
            headers = new Headers();
            url = SERVER_ADDRESS + 'auth/logout';
            instance = new AppAuth();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            spy = jest.spyOn(appPouchDB,'destroyDatabase');
            spys = jest.spyOn(appSession,'removeSessionData');
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
            appSession.saveSessionData(session);
            let mocks:any = {sessionProvider: appSession, pouchDBProvider:appPouchDB};
            instance.initMocks(mocks);
            let auth:string = "Bearer " + session.token + ':' + session.password;
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', auth);
        })
        afterEach(async () => {
            // Unmock.
            fetchMock.resetMocks();
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appSession.resetMock();
            appPouchDB.resetMock();
            spy.mockReset();
            spy.mockRestore();
            spys.mockReset();
            spys.mockRestore();
        });
        it('Should return status 200 when logging out of CouchDB is successful', async () => {
            appPouchDB.responseMock({status: 200, result:'logged out'});
            let body: any = {ok: true, success: "Logged out"};
            let init:any = { "url":url, "ok" : false, "status" : 200 ,
             "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let options:any = {session: session};
            const result:any = await instance.logout(options);
            expect(spys).toHaveBeenCalled();
            expect(spys).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(result.status).toEqual(200);
            expect(result.result).toEqual('Logged out');
            let db: any = await appPouchDB.getDB();
            expect(db).toBeNull();
        });
        
        it('Should return status 401 when logging out of CouchDB is not successful', async () => {
            let body: any = {status:401, message:"Unauthorized: Not logged"};
            let init:any = { "url":url, "ok" : false, "status" : 401 ,
             "statusText" : "Unauthorized" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let options:any = {session: session};
            const result:any = await instance.logout(options);
            expect(spys).not.toHaveBeenCalled();
            expect(spy).not.toHaveBeenCalled();
            expect(result).toEqual(body);
        });        
        it('Should return status 400 when logging out of CouchDB with no session defined', async () => {
            appSession.saveSessionData(null);
            let body: any = {status:400, message:"No session opened"};
            let init:any = { "url":url, "ok" : false, "status" : 400 ,
             "statusText" : "Unauthorized" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            let curSession = await appSession.getSessionData();
            let options:any = {session: curSession};
            const result:any = await instance.logout(options);
            expect(spys).not.toHaveBeenCalled();
            expect(spy).not.toHaveBeenCalled();
            expect(result).toEqual(body);
        });
    });
    describe('app-auth Servers connected', async () => {
        let headers: Headers;
        let url: string;
        let instance: any;
        let appSession: any;
        let appPouchDB: any;

        beforeEach(() => {
            headers = new Headers();
            url = SERVER_ADDRESS + 'server';
            headers.append('Content-Type', 'application/json');
            instance = new AppAuth();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            let mocks:any = {sessionProvider: appSession, pouchDBProvider:appPouchDB};
            instance.initMocks(mocks);
            });
        afterEach(() => {
            // Unmock.
            fetchMock.resetMocks();
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appSession.resetMock();
            appPouchDB.resetMock();
        });
        it('Should return status 200 when both servers are connected', async () => {
            appPouchDB.responseMock({status: 200, message: "Server Alive"});
            let body: any = {status: 200, message: "Server Alive", result: {server:true,dbserver:true}};
            let init:any = { "url":url, "ok" : true, "status" : 200 ,
             "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            const result:any = await instance.isServersConnected();
            expect(result.status).toEqual(200);
            expect(result.message).toEqual('Server Alive');
            expect(result.result.server).toBeTruthy();
            expect(result.result.dbserver).toBeTruthy();
            let isServer: any = await instance.getIsServer();
            expect(isServer).toBeTruthy();
        });   
        it('Should return status 200 when the Application Server is connected and the CouchDB server disconnected', async () => {
            appPouchDB.responseMock({status: 200, message: "Server Alive"});
            let body: any = {status: 200, message: "Server Alive", result: {server:true,dbserver:false}};
            let init:any = { "url":url, "ok" : true, "status" : 200 ,
             "statusText" : "OK" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            const result:any = await instance.isServersConnected();
            expect(result.status).toEqual(200);
            expect(result.message).toEqual('Server Alive');
            expect(result.result.server).toBeTruthy();
            expect(result.result.dbserver).toBeFalsy();
            let isServer: any = await instance.getIsServer();
            expect(isServer).toBeTruthy();
        }); 
        it('Should return status 400 when the Application Server is disconnected', async () => {
            appPouchDB.responseMock({status: 400, message: "Application Server not connected"});
            fetchMock.mockReject('TypeError:Failed to fetch');
            const result:any = await instance.isServersConnected();
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('Application Server not connected');
            let isServer: boolean = await instance.getIsServer();
            expect(isServer).toBeFalsy();
            let isServerDB:boolean = await appPouchDB.isServerDBAlive();
            expect(isServerDB).toBeFalsy();
        });
    }); 
});