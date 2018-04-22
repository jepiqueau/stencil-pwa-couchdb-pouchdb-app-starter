import { TestWindow } from '@stencil/core/testing';
import { AppPage} from './app-page';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import AppConnMock from '../../../__mocks__/app-connection';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import NavCmptMock from '../../../__mocks__/nav';
import { Session } from '../../global/interfaces';

let appSession: any;
let appAuth: any;
let appConn: any;
let errCtrl: any;
let loadingCtrl: any;
let navCmpt: any;

let spy: jest.SpyInstance<any>;
let spyS: jest.SpyInstance<any>;
let spyR: jest.SpyInstance<any>;
let spyE: jest.SpyInstance<any>;
const resetSpys = () => {
    spy = null;
    spyS = null;
    spyR = null;
    spyE = null;
};
const defineSpys = () => {
    spy = jest.spyOn(appAuth,'isServersConnected');
    spyS = jest.spyOn(appSession,'getSessionData');
    spyR = jest.spyOn(appAuth,'reauthenticate');
    spyE = jest.spyOn(errCtrl,'showError');

};
describe('app-page', () => {
    it('should build', () => {
        expect(new AppPage()).toBeTruthy();
    });
    describe('rendering', () => {
        let element: any;
        let mocks:any;
        let page: HTMLElement;
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
                components: [AppPage],
                html: '<app-page></app-page>'
            });
            appAuth = new AppAuthMock();
            appSession = new AppSessionMock();
            appConn = new AppConnMock();
            errCtrl = new ErrCtrlMock();
            loadingCtrl = new LoadingCtrlMock();
            navCmpt = new NavCmptMock();
            dom = window.document;
            navCmpt.setDomMock(dom);
            mocks = {
                authProvider:appAuth,
                sessionProvider:appSession,
                connectionProvider:appConn,
                errorCtrl:errCtrl,
                loadingCtrl:loadingCtrl,
                navCmpt:navCmpt
            }
        });
        afterEach(() => {
            window = null;
            dom = null;
            appConn.restoreMock();
            errCtrl.restoreMock();
            errCtrl.resetMock();
            loadingCtrl.restoreMock();
            loadingCtrl.resetMock();
            navCmpt.restoreMock();
            appConn.resetMock();
            navCmpt.resetMock();
//            appAuth.restoreMock();
            appAuth.resetMock();
            appSession.restoreMock();
            appSession.resetMock();
        });
        it('should have a ion-page component', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            expect(page).not.toBeNull();
        });
        it('should have an app-header component', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let header: HTMLElement = page.querySelector('app-header');
            expect(header).not.toBeNull();
        });
        it('should have an ion-content component', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            expect(content).not.toBeNull();
        });
        it('should have an app-logo component', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let logo: HTMLElement = content.querySelector('app-logo');
            expect(logo).not.toBeNull();
        });
        it('should have a div with class text attribute', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let div: HTMLElement = content.querySelector('.text');
            expect(div).not.toBeNull();
        });     
        it('should display a text', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let div: HTMLElement = content.querySelector('.text');
            let text: HTMLElement = div.querySelector('h2');
            expect(text.textContent).toEqual('Welcome to the Jeep PouchDB Application Starter');
        });
        it('should return status 400 when server disconnected and session null', async (done) => {
            await window.flush();
            defineSpys();
            appAuth.responseMock({status:400,message:'Application Server not connected'});
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(() => {
                    expect(spy).toHaveBeenCalled();                
                    expect(spyS).toHaveBeenCalled();                
                    expect(spyR).not.toHaveBeenCalled();                
                    expect(spyE).toHaveBeenCalled();                
                    resetSpys();
                    expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
                    done();
                });
            });

        });
        it('should return status 400 when Application server connected DBServer disconnected and session null', async (done) => {
            await window.flush();
            defineSpys();
            let server:any = {status:200,result:{server:true,dbserver:false}};
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(() => {
                    expect(spy).toHaveBeenCalled();                
                    expect(spyS).toHaveBeenCalled();                
                    expect(spyR).not.toHaveBeenCalled();                
                    expect(spyE).toHaveBeenCalled();                
                    resetSpys();
                    expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
                    done();
                });
            });
        });
        it('should return status 200 when servers are connected and session exists', async (done) => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toEqual('app-home');
                    expect(navCmpt.getDataMock()).toEqual({mode:'connected'});        
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
                    expect(navCmpt.getPageMock()).toEqual('app-home');
                    expect(navCmpt.getDataMock()).toEqual({mode:'offline'});        
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
    });
});