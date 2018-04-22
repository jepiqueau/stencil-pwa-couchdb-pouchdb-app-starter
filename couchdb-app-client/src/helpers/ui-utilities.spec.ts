import { TestWindow } from '@stencil/core/testing';
import {showToast, presentLoading, dismissLoading, getIonApp, getPouchDBProvider,
        getErrorController, getAuthProvider, getSessionProvider, initializeComponents,
        initializeMocks,checkServersConnected,getIonRouter,getIonRoutes,
        getComponentFromUrl, getPreviousUrl, getUrl } from './ui-utilities'
import toastCtrlMock from '../../__mocks__/toastcontroller';
import loadingCtrlMock from '../../__mocks__/loadingcontroller';
import AppSessionMock from '../../__mocks__/app-session';
import AppPouchDBMock from '../../__mocks__/app-pouchdb';
import AppAuthMock from '../../__mocks__/app-auth';
import AppConnMock from '../../__mocks__/app-connection';
import ErrCtrlMock from '../../__mocks__/errorcontroller';
import NavCmptMock from '../../__mocks__/nav';
import { Session } from '../global/interfaces';

describe('ui-utilities', () => {

    let window: TestWindow;
    let dom: Document;
    let toastCtrl: any;
    let loadingCtrl: any;
    let errCtrlMock: any;
    let sessionProvMock: any;
    let pouchDBProvMock: any;
    let authProvMock: any;
    let connProvMock: any;
    let navCmptMock: any;
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
    beforeEach(() => {
        window = new TestWindow();
        dom = window.document;
        dom.body.innerHTML="";
        toastCtrl = new toastCtrlMock();        
        loadingCtrl = new loadingCtrlMock();        
        errCtrlMock = new ErrCtrlMock();
        sessionProvMock = new AppSessionMock();
        pouchDBProvMock = new AppPouchDBMock();
        authProvMock = new AppAuthMock();
        navCmptMock = new NavCmptMock();
        connProvMock = new AppConnMock();
    });
    afterEach(() => {
        toastCtrl.restoreMock();
        toastCtrl.resetMock();        
        loadingCtrl.restoreMock();
        loadingCtrl.resetMock(); 
        errCtrlMock.restoreMock();
        errCtrlMock.resetMock();
        sessionProvMock.restoreMock();
        sessionProvMock.resetMock();
        pouchDBProvMock.restoreMock();
        pouchDBProvMock.resetMock();
        authProvMock.restoreMock();
        authProvMock.resetMock();
        connProvMock.restoreMock();
        connProvMock.resetMock();
        navCmptMock.restoreMock();
        navCmptMock.resetMock();
        navCmptMock = null;
        errCtrlMock = null;
        sessionProvMock = null;
        pouchDBProvMock = null;
        authProvMock = null;
        connProvMock = null;
        window = null;
        dom = null;       
    });
    it('should raise the show ErrorToast', async () => {
        await showToast(toastCtrl,'error in connection');
        expect(toastCtrl.getToastMock().getContentMock().message).toEqual('error in connection');
    });
    it('should present loading', async () => {
        await presentLoading(loadingCtrl,'Authenticating ...');
        expect(loadingCtrl.getLoadingMock().getContentMock()).toEqual('Authenticating ...');
    });
    it('should dismiss loading', async () => {
        await presentLoading(loadingCtrl,'Authenticating ...');
        await dismissLoading();           
        expect(loadingCtrl.getLoadingMock().getContentMock()).toBeNull();
    });
    it('should get the ion-app element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        let ionAppEl: HTMLIonAppElement = await getIonApp(dom);
        expect(ionAppEl).toBeTruthy();
    });
   it('should get the ion-router element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const router: HTMLIonRouterElement = dom.createElement('ion-router') as HTMLIonRouterElement;
        el.appendChild(router); 
        let ionRouterEl: HTMLIonRouterElement = await getIonRouter(dom);
        expect(ionRouterEl).toBeTruthy();
    });
    it('should get two routes from the ion-router element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const router: HTMLIonRouterElement = dom.createElement('ion-router') as HTMLIonRouterElement;
        el.appendChild(router);             
        const route1: HTMLIonRouteElement = dom.createElement('ion-route') as HTMLIonRouteElement;
        const route2: HTMLIonRouteElement = dom.createElement('ion-route') as HTMLIonRouteElement;
        router.appendChild(route1);
        router.appendChild(route2);
        let routes = await getIonRoutes(dom);
        expect(routes).toBeTruthy();
        expect(routes.length).toEqual(2);
    });
    
    it('should get the component for a given url', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const router: HTMLIonRouterElement = dom.createElement('ion-router') as HTMLIonRouterElement;
        el.appendChild(router);             
        const route1: HTMLIonRouteElement = dom.createElement('ion-route') as HTMLIonRouteElement;
        const route2: HTMLIonRouteElement = dom.createElement('ion-route') as HTMLIonRouteElement;
        const route3: HTMLIonRouteElement = dom.createElement('ion-route') as HTMLIonRouteElement;
        route1.url = '/';
        route1.component = "app-page";
        router.appendChild(route1);
        route2.url = '/news/display';
        route2.component = "app-news-display";
        router.appendChild(route2);
        route3.url = '/news/display/item:itemObj';
        route3.component = "app-news-item";
        router.appendChild(route3);
        let url:string = '/news/display';
        let comp:string = await getComponentFromUrl(url,dom)
        expect(comp).toBeTruthy();
        expect(comp).toEqual("app-news-display");
    });
    it('should get the component for a given url', async () => {
        const location:string = "http://localhost:3330/#/news/display/item:itemObj"
        let url:string = getPreviousUrl(location);
        expect(url).toBeTruthy();
        expect(url).toEqual('/news/display');
    });
//
    it('should get the app-pouchdb element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const pDB: HTMLAppPouchdbElement = dom.createElement('app-pouchdb') as HTMLAppPouchdbElement;
        el.appendChild(pDB);             
        let pouchDBEl: HTMLAppPouchdbElement = await getPouchDBProvider(dom);
        expect(pouchDBEl).toBeTruthy();
    });
    it('should get the app-auth element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const auth: HTMLAppAuthElement = dom.createElement('app-auth') as HTMLAppAuthElement;
        el.appendChild(auth);             
        let authEl: HTMLAppAuthElement = await getAuthProvider(dom);
        expect(authEl).toBeTruthy();
    });
    it('should get the app-session element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const session: HTMLAppSessionElement = dom.createElement('app-session') as HTMLAppSessionElement;
        el.appendChild(session);             
        let sessionEl: HTMLAppSessionElement = await getSessionProvider(dom);
        expect(sessionEl).toBeTruthy();
    });
    it('should get the app-error element', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const err: HTMLAppErrorElement = dom.createElement('app-error') as HTMLAppErrorElement;
        el.appendChild(err);             
        let errEl: HTMLAppErrorElement = await getErrorController(dom);
        expect(errEl).toBeTruthy();
    });
    it('should initialize ErrorController component ', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const err: HTMLAppErrorElement = dom.createElement('app-error') as HTMLAppErrorElement;
        el.appendChild(err);             
        let comps: any = {errorCtrl:true};
        await initializeComponents(comps,dom);
        expect(comps.errorCtrl).toBeDefined();
        expect(comps.errorCtrl.tagName).toEqual('APP-ERROR');
    });
    it('should get the sessionProvider component', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const session: HTMLAppSessionElement = dom.createElement('app-session') as HTMLAppSessionElement;
        el.appendChild(session);             
        let comps: any = {sessionProvider:true};
        await initializeComponents(comps,dom);
        expect(comps.sessionProvider).toBeDefined();
        expect(comps.sessionProvider.tagName).toEqual('APP-SESSION');
    });
    it('should get the pouchdbProvider component', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const pDB: HTMLAppPouchdbElement = dom.createElement('app-pouchdb') as HTMLAppPouchdbElement;
        el.appendChild(pDB);             
        let comps: any = {pouchDBProvider:true};
        await initializeComponents(comps,dom);
        expect(comps.pouchDBProvider).toBeDefined();
        expect(comps.pouchDBProvider.tagName).toEqual('APP-POUCHDB');
    });
    it('should get the authProvider component', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const auth: HTMLAppAuthElement = dom.createElement('app-auth') as HTMLAppAuthElement;
        el.appendChild(auth);             
        let comps: any = {authProvider:true};
        await initializeComponents(comps,dom);
        expect(comps.authProvider).toBeDefined();
        expect(comps.authProvider.tagName).toEqual('APP-AUTH');
    });
    it('should get all Provider components', async () => {
        const el:HTMLIonAppElement = dom.createElement('ion-app') as HTMLIonAppElement;
        dom.body.appendChild(el);
        const auth: HTMLAppAuthElement = dom.createElement('app-auth') as HTMLAppAuthElement;
        el.appendChild(auth);             
        const pDB: HTMLAppPouchdbElement = dom.createElement('app-pouchdb') as HTMLAppPouchdbElement;
        el.appendChild(pDB);             
        const session: HTMLAppSessionElement = dom.createElement('app-session') as HTMLAppSessionElement;
        el.appendChild(session);             
        const err: HTMLAppErrorElement = dom.createElement('app-error') as HTMLAppErrorElement;
        el.appendChild(err);             
        let comps: any = {authProvider:true,sessionProvider:true,pouchDBProvider:true,
                        errorCtrl:true};
        await initializeComponents(comps,dom);
        expect(comps.authProvider.tagName).toEqual('APP-AUTH');
        expect(comps.pouchDBProvider.tagName).toEqual('APP-POUCHDB');
        expect(comps.sessionProvider.tagName).toEqual('APP-SESSION');
        expect(comps.errorCtrl.tagName).toEqual('APP-ERROR');
    });
    it('should initialize ErrorController component from mock', async () => {
        let mocks = {errorCtrl: errCtrlMock};
        let comps: any = {errorCtrl:true};
        await initializeMocks(comps,mocks);
        expect(comps.errorCtrl).toBeDefined();
        expect(comps.errorCtrl.getMessageMock()).toBeNull;
    });
    it('should initialize SessionProvider component from mock', async () => {
        let mocks = {sessionProvider: sessionProvMock};
        let comps: any = {sessionProvider:true};
        await initializeMocks(comps,mocks);
        expect(comps.sessionProvider).toBeDefined();
        expect(comps.sessionProvider.getCurrentSession()).toBeNull;
    });
    it('should initialize PouchDBProvider component from mock', async () => {
        let mocks = {pouchDBProvider: pouchDBProvMock};
        let comps: any = {pouchDBProvider:true};
        await initializeMocks(comps,mocks);
        expect(comps.pouchDBProvider).toBeDefined();
        expect(comps.pouchDBProvider.getDB()).toBeNull;
    });
    it('should initialize AuthProvider component from mock', async () => {
        let mocks = {authProvider: authProvMock};
        let comps: any = {authProvider:true};
        await initializeMocks(comps,mocks);
        expect(comps.authProvider).toBeDefined();
        expect(await comps.authProvider.getIsServer()).toBeFalsy();
    });
    it('should initialize all Providers component from mocks', async () => {
        let mocks = {authProvider: authProvMock,
            pouchDBProvider: pouchDBProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            navCmpt: navCmptMock};
        let comps: any = {authProvider:true,
            pouchDBProvider:true,
            sessionProvider:true,
            errorCtrl:true,
            navCmpt:true};
        await initializeMocks(comps,mocks);
        expect(await comps.authProvider.getIsServer()).toBeFalsy();
        expect(comps.pouchDBProvider.getDB()).toBeNull;
        expect(comps.sessionProvider.getCurrentSession()).toBeNull;
        expect(comps.errorCtrl.getMessageMock()).toBeNull;
    });
    it('should return status 400 when server disconnected and session null', async () => {
        let mocks:any = {
            authProvider: authProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            navCmpt: navCmptMock
        };
        let comps:any = {authProvider:true,sessionProvider:true,errorCtrl:true,
            navCmpt:true} 
        await initializeMocks(comps,mocks);
        comps.authProvider.responseMock({status:400,message:'Application Server not connected'});
        await checkServersConnected(loadingCtrl,comps, 'page','Connecting ...')
        expect(comps.errorCtrl.getMessageMock()).toEqual("Application Server not connected");                                   
    });
    it('should return status 400  and stay on Page page when Application server connected DBServer disconnected and session null', async () => {
        let mocks:any = {
            authProvider: authProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            navCmpt: navCmptMock
        };
        let comps:any = {authProvider:true,sessionProvider:true,errorCtrl:true,
            navCmpt:true} 
        await initializeMocks(comps,mocks);
        let server:any = {status:200,result:{server:true,dbserver:false}};
        comps.authProvider.responseMock(server);
        await checkServersConnected(loadingCtrl,comps, 'page','Connecting ...')
        expect(comps.errorCtrl.getMessageMock()).toEqual("Application Server not connected");                                   
    });
    it('should return status 200  and navigate to Home page when servers are connected and session exists', async () => {
        let mocks:any = {
            authProvider: authProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            connectionProvider: connProvMock,
            navCmpt: navCmptMock
        };
        let comps:any = {authProvider:true,sessionProvider:true,errorCtrl:true,
            navCmpt:true,connectionProvider:true} 
        await initializeMocks(comps,mocks);
        let server:any = {status:200,result:{server:true,dbserver:true}};
        comps.sessionProvider.saveSessionData(session);
        comps.authProvider.dataReauthenticateMock({status:200});
        comps.authProvider.responseMock(server);
        await checkServersConnected(loadingCtrl,comps, 'page','Connecting ...')
        expect(navCmptMock.getPageMock()).toEqual('app-home');
    });
    it('should return status 200  and navigate to Home page when servers are disconnected and session exists', async () => {
        let mocks:any = {
            authProvider: authProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            connectionProvider: connProvMock,
            navCmpt: navCmptMock
        };
        let comps:any = {authProvider:true,sessionProvider:true,errorCtrl:true,
            navCmpt:true,connectionProvider:true} 
        await initializeMocks(comps,mocks);
        let server:any = {status:400,message:'Application Server not connected'};
        comps.authProvider.dataReauthenticateMock({status:200});
        comps.sessionProvider.saveSessionData(session);
        comps.authProvider.responseMock(server);
        await checkServersConnected(loadingCtrl,comps, 'page','Connecting ...')
        expect(navCmptMock.getPageMock()).toEqual('app-home');
        expect(comps.errorCtrl.getMessageMock()).toEqual("Working Offline");                    
    });
    it('should return status 400  and navigate to Login page when servers are connected and session expired', async () => {
        let mocks:any = {
            authProvider: authProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            navCmpt: navCmptMock
        };
        let comps:any = {authProvider:true,sessionProvider:true,errorCtrl:true,
            navCmpt:true} 
        await initializeMocks(comps,mocks);
        let server:any = {status:200,result:{server:true,dbserver:true}};
        session.issued = 1517680659920;
        session.expires = 1517767059920;
        comps.authProvider.dataReauthenticateMock({status:400,message: 'Session expired'});
        comps.sessionProvider.saveSessionData(session);
        comps.authProvider.responseMock(server);
        await checkServersConnected(loadingCtrl,comps, 'page','Connecting ...')
        expect(navCmptMock.getPageMock()).toEqual('app-login');
        expect(comps.errorCtrl.getMessageMock()).toEqual("Session expired");                    
    });
    it('should return status 400 and navigate to Login page hen servers are connected and no session opended', async () => {
        let mocks:any = {
            authProvider: authProvMock,
            sessionProvider: sessionProvMock,
            errorCtrl: errCtrlMock,
            navCmpt: navCmptMock
        };
        let comps:any = {authProvider:true,sessionProvider:true,errorCtrl:true,
            navCmpt:true} 
        await initializeMocks(comps,mocks);
        let server:any = {status:200,result:{server:true,dbserver:true}};
        comps.authProvider.dataReauthenticateMock({status:400,message: 'No session opened'});
        comps.authProvider.responseMock(server);
        await checkServersConnected(loadingCtrl,comps, 'page','Connecting ...')
        expect(navCmptMock.getPageMock()).toEqual('app-login');
        expect(comps.errorCtrl.getMessageMock()).toEqual("No session opened");                    
    });
});
