import { TestWindow } from '@stencil/core/testing';
import { AppNewsCreate } from './app-news-create';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';
import AppConnMock from '../../../__mocks__/app-connection';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import NavCmptMock from '../../../__mocks__/nav';
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
        let navCmpt: any;
        let loadingCtrl: any;
        let mocks: any;
        let window: TestWindow;
        let dom: Document;
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
            window = new TestWindow();
            element = await window.load({
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
            navCmpt = new NavCmptMock();
            dom = window.document;
            navCmpt.setDomMock(dom);
            mocks = {
                authProvider:appAuth,
                sessionProvider:appSession,
                pouchDBProvider:appPouchDB,
                errorCtrl:errCtrl,
                loadingCtrl:loadingCtrl,
                navCmpt:navCmpt,
                connectionProvider: appConn 
            }
        });
        afterEach(async () => {
            window = null;
            dom = null;
//            appAuth.restoreMock();
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appConn.restoreMock();
            errCtrl.restoreMock();
            navCmpt.restoreMock();
            loadingCtrl.restoreMock();
            appAuth.resetMock();
            appSession.resetMock();
            appPouchDB.resetMock();
            appConn.resetMock();
            errCtrl.resetMock();
            navCmpt.resetMock();
            loadingCtrl.resetMock();
            
        });
        it('should have a ion-page component', async () => {
            await window.flush();
            expect(page).not.toBeNull();
        });
        it('should have an app-header component', async () => {
            await window.flush();
            let header: HTMLAppHeaderElement = page.querySelector('app-header');
            expect(header).not.toBeNull();
        });
        it('should have an ion-content component', async () => {
            await window.flush();
            let content: HTMLElement = page.querySelector('ion-content');
            expect(content).not.toBeNull();
        });
        it('should have a news-create-card ', async () => {
            await window.flush();
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#news-create-card'); 
            expect(card).not.toBeNull();
        });
        it('should have a form element ', async () => {
            await window.flush();
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#news-create-card');
            let form: HTMLFormElement = card.querySelector('.news-create-form');
            expect(form).not.toBeNull();
        });
        it('should have a form with 4 entries ', async () => {
            await window.flush();
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
            await window.flush();
            appAuth.responseMock({status:400,message:'Application Server not connected'});
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
        });
        it('should return status 400 when Application server connected DBServer disconnected and session null', async () => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:false}};
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
        });
        it('should return status 200 when servers are connected and session exists', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toBeNull;
                    done();
                });
            });
        });
        it('should return status 200 when servers are disconnected and session exists', async (done) => {
            await window.flush();
            let server:any = {status:400,message:'Application Server not connected'};
            element.initMocks(mocks).then(() => {
                appAuth.dataReauthenticateMock({status:200});
                appSession.saveSessionData(session);
                appAuth.responseMock(server);
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toBeNull;
                    expect(errCtrl.getMessageMock()).toEqual("Working Offline");                    
                    done();
                });
            });
        });
        it('should return status 400 when servers are connected and session expired', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            session.issued = 1517680659920;
            session.expires = 1517767059920;
            element.initMocks(mocks).then(() => {
                appSession.saveSessionData(session);
                appAuth.dataReauthenticateMock({status:400,message: 'Session expired'});
                appAuth.responseMock(server);
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toEqual('app-login');
                    expect(errCtrl.getMessageMock()).toEqual("Session expired");                    
                    done();
                });
            });
        });
        it('should return status 400 when servers are connected and no session opended', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            element.initMocks(mocks).then(() => {
                appAuth.dataReauthenticateMock({status:400,message: 'No session opened'});
                appAuth.responseMock(server);
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toEqual('app-login');
                    expect(errCtrl.getMessageMock()).toEqual("No session opened");                    
                    done();
                });
            });
        });
        it('should not validated the title if null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let titleEl: HTMLElement = element.querySelector('#title');
                    await element.handleChangeNewsTitle('');
                    expect(titleEl.classList.contains('validated')).toBeFalsy();
                    done();
                });
            });
        });        
        it('should validated the title if not null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let titleEl: HTMLElement = element.querySelector('#title');
                    await element.handleChangeNewsTitle('First News');
                    expect(titleEl.classList.contains('validated')).toBeTruthy();
                    done();
                });
            });
        });        
        it('should not validated the author if null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let authorEl: HTMLElement = element.querySelector('#author');
                    await element.handleChangeNewsAuthor('');
                    expect(authorEl.classList.contains('validated')).toBeFalsy();
                    done();
                });
            });
        });        
        it('should validated the author if not null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let authorEl: HTMLElement = element.querySelector('#author');
                    await element.handleChangeNewsAuthor('Jeep');
                    expect(authorEl.classList.contains('validated')).toBeTruthy();
                    done();
                });
            });
        });        
        it('should not validated the content if null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let contentEl: HTMLElement = element.querySelector('#content');
                    await element.handleChangeNewsContent('');
                    expect(contentEl.classList.contains('validated')).toBeFalsy();
                    done();
                });
            });
        });        
        it('should validated the content if not null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let contentEl: HTMLElement = element.querySelector('#content');
                    await element.handleChangeNewsContent('Hello World!');
                    expect(contentEl.classList.contains('validated')).toBeTruthy();
                    done();
                });
            });
        });        
        it('should not have the button visible when title,author and content are null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let buttonEl: HTMLElement = element.querySelector('#button');
                    await element.handleChangeNewsTitle('');
                    await element.handleChangeNewsAuthor('');
                    await element.handleChangeNewsContent('');
                    expect(buttonEl.classList.contains('visible')).toBeFalsy();
                    done();
                });
            });
        });
        it('should not have the button visible when title defined and author,content are null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let buttonEl: HTMLElement = element.querySelector('#button');
                    await element.handleChangeNewsTitle('First News');
                    await element.handleChangeNewsAuthor('');
                    await element.handleChangeNewsContent('');
                    expect(buttonEl.classList.contains('visible')).toBeFalsy();
                    done();
                });
            });
        });        
        it('should not have the button visible when title,author defined and content is null', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let buttonEl: HTMLElement = element.querySelector('#button');
                    await element.handleChangeNewsTitle('First News');
                    await element.handleChangeNewsAuthor('Jeep');
                    await element.handleChangeNewsContent('');
                    expect(buttonEl.classList.contains('visible')).toBeFalsy();
                    done();
                });
            });
        }); 
        it('should have the button visible when title,author and content defined', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let buttonEl: HTMLElement = element.querySelector('#button');
                    await element.handleChangeNewsTitle('First News');
                    await element.handleChangeNewsAuthor('Jeep');
                    await element.handleChangeNewsContent('Hello World!');
                    expect(buttonEl.classList.contains('visible')).toBeTruthy();
                    done();
                });
            });
        });        
        it('should not create the news document when clicking on the Create button', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
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
                    done();
                });
            });
        });        
        it('should create the news document without text attachment when clicking on the Create button', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    appPouchDB.responseMock({addTextAttach:'Error: News document created with no Text Attachment'});
                    await element.initMocks(mocks);
                    let buttonEl: HTMLElement = element.querySelector('#button');
                    await element.handleChangeNewsTitle('First News');
                    await element.handleChangeNewsAuthor('Jeep');
                    await element.handleChangeNewsContent('Hello World!');
                    expect(buttonEl.classList.contains('visible')).toBeTruthy();
                    await element.handleSubmit();
                    expect(errCtrl.getMessageMock()).toEqual("Error: News document created with no Text Attachment");                    
                    done();
                });
            });
        });        
        it('should create the news document with text attachment when clicking on the Create button', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let buttonEl: HTMLElement = element.querySelector('#button');
                    await element.handleChangeNewsTitle('First News');
                    await element.handleChangeNewsAuthor('Jeep');
                    await element.handleChangeNewsContent('Hello World!');
                    expect(buttonEl.classList.contains('visible')).toBeTruthy();
                    await element.handleSubmit();
                    expect(errCtrl.getMessageMock()).toEqual("The News document has been succesfully created");                    
                    done();
                });
            });
        });
    });
});

