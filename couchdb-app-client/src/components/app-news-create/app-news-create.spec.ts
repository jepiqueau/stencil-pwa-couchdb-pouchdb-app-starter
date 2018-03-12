import { render, flush } from '@stencil/core/testing';
import { AppNewsCreate } from './app-news-create';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';
import AppConnMock from '../../../__mocks__/app-connection';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import HistoryRouterMock from '../../../__mocks__/historyrouter';
import { Session } from '../../global/interfaces';

describe('app-news-create', () => {
    it('should build', () => {
        expect(new AppNewsCreate()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let page: HTMLElement;
        let appSession: any;
        let appPouchDB: any;
        let appAuth: any;
        let appConn:any;
        let errCtrl: any;
        let history: any;
        let loadingCtrl: any;
        let mocks: any;
        let session: Session = {
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
        beforeEach(async () => {
            element = await render({
                components: [AppNewsCreate],
                html: '<app-news-create></app-news-create>'
            });
            page = element.querySelector('ion-page');
            appAuth = new AppAuthMock();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            appConn = new AppConnMock();
            errCtrl = new ErrCtrlMock();
            loadingCtrl = new LoadingCtrlMock();
            history = new HistoryRouterMock();
            mocks = {
                authProvider:appAuth,
                sessionProvider:appSession,
                pouchDBProvider:appPouchDB,
                errorCtrl:errCtrl,
                loadingCtrl:loadingCtrl,
                history:history,
                connectionProvider: appConn 
            }
        });
        afterEach(async () => {
            appAuth.restoreMock();
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appConn.restoreMock();
            errCtrl.restoreMock();
            history.restoreMock();
            loadingCtrl.restoreMock();
            appAuth.resetMock();
            appSession.resetMock();
            appPouchDB.resetMock();
            appConn.resetMock();
            errCtrl.resetMock();
            history.resetMock();
            loadingCtrl.resetMock();
            appAuth = null;
            appSession = null;
            appPouchDB = null;
            appConn = null;
            errCtrl = null;
            loadingCtrl = null;
            history = null;
            mocks = null;
            
        });
        it('should have a ion-page component', async () => {
            await flush(element);
            expect(page).not.toBeNull();
        });
        it('should have an app-header component', async () => {
            await flush(element);
            let header: HTMLElement = page.querySelector('app-header');
            expect(header).not.toBeNull();
        });
        it('should have an app-menu component', async () => {
            await flush(element);
            let menu: HTMLElement = page.querySelector('app-menu');
            expect(menu).not.toBeNull();
        });
        it('should have an ion-content component', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            expect(content).not.toBeNull();
        });
        it('should have a news-create-card ', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#news-create-card'); 
            expect(card).not.toBeNull();
        });
        it('should have a form element ', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#news-create-card');
            let form: HTMLFormElement = card.querySelector('.news-create-form');
            expect(form).not.toBeNull();
        });
        it('should have a form with 4 entries ', async () => {
            await flush(element);
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#news-create-card');
            let form: HTMLFormElement = card.querySelector('.news-create-form');
            expect(form.hasChildNodes()).toBeTruthy();

            let inputs:HTMLCollection = form.children; 
            expect(inputs.length).toEqual(4);
            expect(inputs[0].getAttribute('id')).toEqual('title');
            expect(inputs[1].getAttribute('id')).toEqual('author');
            expect(inputs[2].getAttribute('id')).toEqual('content');
            expect(inputs[3].getAttribute('id')).toEqual('button');
        });
        it('should return status 400 when server disconnected and session null', async () => {
            await flush(element);
            appAuth.responseMock({status:400,message:'Application Server not connected'});
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
        });
        it('should return status 400 when Application server connected DBServer disconnected and session null', async () => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:false}};
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
        });
        it('should return status 200 when servers are connected and session exists', async () => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(history.getPathMock()).toBeNull();
        });
        it('should return status 200 when servers are disconnected and session exists', async () => {
            await flush(element);
            let server:any = {status:400,message:'Application Server not connected'};
            appAuth.dataReauthenticateMock({status:200});
            appSession.saveSessionData(session);
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(history.getPathMock()).toBeNull();
            expect(errCtrl.getMessageMock()).toEqual("Working Offline");                    
        });
        it('should return status 400 when servers are connected and session expired', async () => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            session.issued = 1517680659920;
            session.expires = 1517767059920;
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:400,message: 'Session expired'});
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(history.getPathMock()).toEqual('/login');
            expect(errCtrl.getMessageMock()).toEqual("Session expired");                    
        });
        it('should return status 400 when servers are connected and no session opended', async () => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            appAuth.dataReauthenticateMock({status:400,message: 'No session opened'});
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(history.getPathMock()).toEqual('/login');
            expect(errCtrl.getMessageMock()).toEqual("No session opened");                    
        });
        it('should not validated the title if null', async () => {
            await flush(element);
            let titleEl: HTMLElement = element.querySelector('#title');
            await element.handleChangeNewsTitle('');
            expect(titleEl.classList.contains('validated')).toBeFalsy();
        });        
        it('should validated the title if not null', async () => {
            await flush(element);
            let titleEl: HTMLElement = element.querySelector('#title');
            await element.handleChangeNewsTitle('First News');
            expect(titleEl.classList.contains('validated')).toBeTruthy();
        });        
        it('should not validated the author if null', async () => {
            await flush(element);
            let authorEl: HTMLElement = element.querySelector('#author');
            await element.handleChangeNewsAuthor('');
            expect(authorEl.classList.contains('validated')).toBeFalsy();
        });        
        it('should validated the author if not null', async () => {
            await flush(element);
            let authorEl: HTMLElement = element.querySelector('#author');
            await element.handleChangeNewsAuthor('Jeep');
            expect(authorEl.classList.contains('validated')).toBeTruthy();
        });        
        it('should not validated the content if null', async () => {
            await flush(element);
            let contentEl: HTMLElement = element.querySelector('#content');
            await element.handleChangeNewsContent('');
            expect(contentEl.classList.contains('validated')).toBeFalsy();
        });        
        it('should validated the content if not null', async () => {
            await flush(element);
            let contentEl: HTMLElement = element.querySelector('#content');
            await element.handleChangeNewsContent('Hello World!');
            expect(contentEl.classList.contains('validated')).toBeTruthy();
        });        
        it('should not have the button visible when title,author and content are null', async () => {
            await flush(element);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('');
            await element.handleChangeNewsAuthor('');
            await element.handleChangeNewsContent('');
            expect(buttonEl.classList.contains('visible')).toBeFalsy();
        });        
        it('should not have the button visible when title defined and author,content are null', async () => {
            await flush(element);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('First News');
            await element.handleChangeNewsAuthor('');
            await element.handleChangeNewsContent('');
            expect(buttonEl.classList.contains('visible')).toBeFalsy();
        });        
        it('should not have the button visible when title,author defined and content is null', async () => {
            await flush(element);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('First News');
            await element.handleChangeNewsAuthor('Jeep');
            await element.handleChangeNewsContent('');
            expect(buttonEl.classList.contains('visible')).toBeFalsy();
        });        
        it('should have the button visible when title,author and content defined', async () => {
            await flush(element);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('First News');
            await element.handleChangeNewsAuthor('Jeep');
            await element.handleChangeNewsContent('Hello World!');
            expect(buttonEl.classList.contains('visible')).toBeTruthy();
        });        
        it('should not create the news document when clicking on the Create button', async () => {
            await flush(element);
            appPouchDB.responseMock({createDoc:'Error: No News document created'},
                    {addTextAttach:'Error: News document created with no Text Attachment'});
            await element.initMocks(mocks);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('First News');
            await element.handleChangeNewsAuthor('Jeep');
            await element.handleChangeNewsContent('Hello World!');
            expect(buttonEl.classList.contains('visible')).toBeTruthy();
            await element.handleSubmit();
            expect(errCtrl.getMessageMock()).toEqual("Error: No News document created");                    
        });        
        it('should create the news document without text attachment when clicking on the Create button', async () => {
            await flush(element);
            appPouchDB.responseMock({addTextAttach:'Error: News document created with no Text Attachment'});
            await element.initMocks(mocks);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('First News');
            await element.handleChangeNewsAuthor('Jeep');
            await element.handleChangeNewsContent('Hello World!');
            expect(buttonEl.classList.contains('visible')).toBeTruthy();
            await element.handleSubmit();
            expect(errCtrl.getMessageMock()).toEqual("Error: News document created with no Text Attachment");                    
        });        
        it('should create the news document with text attachment when clicking on the Create button', async () => {
            await flush(element);
            await element.initMocks(mocks);
            let buttonEl: HTMLElement = element.querySelector('#button');
            await element.handleChangeNewsTitle('First News');
            await element.handleChangeNewsAuthor('Jeep');
            await element.handleChangeNewsContent('Hello World!');
            expect(buttonEl.classList.contains('visible')).toBeTruthy();
            await element.handleSubmit();
            expect(errCtrl.getMessageMock()).toEqual("The News document has been succesfully created");                    
        });        
    });
});

