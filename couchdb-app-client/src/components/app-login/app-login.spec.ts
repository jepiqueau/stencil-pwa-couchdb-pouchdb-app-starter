import { TestWindow } from '@stencil/core/testing';
import { AppLogin} from './app-login';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import NavCmptMock from '../../../__mocks__/nav';
import { Session } from '../../global/interfaces';
import { ERROR_USERNAME, ERROR_PASSWORD } from '../../global/constants';

let appSession: any;
let appAuth: any;
let errCtrl: any;
let navCmpt: any;
let loadingCtrl: any;
describe('app-login', () => {
    it('should build', () => {
        expect(new AppLogin()).toBeTruthy();
    });
    describe('rendering', () => {
        let element: any;
        let mocks:any;
        let page: HTMLElement;
        let window: TestWindow;
        let dom: Document;
        beforeEach(async () => {
            window = new TestWindow();
            element = await window.load({
                    components: [AppLogin],
                html: '<app-login></app-login>'
            });
            dom = window.document;
            appAuth = new AppAuthMock();
            appSession = new AppSessionMock();
            errCtrl = new ErrCtrlMock();
            loadingCtrl = new LoadingCtrlMock();
            navCmpt = new NavCmptMock();
            navCmpt.setDomMock(dom);
            mocks = {
                authProvider:appAuth,
                sessionProvider:appSession,
                errorCtrl:errCtrl,
                loadingCtrl:loadingCtrl,
                navCmpt:navCmpt
            }
        });
        afterEach(async() => {
            window = null;
            dom = null;
            appAuth.restoreMock();
            appSession.restoreMock();
            errCtrl.restoreMock();
            navCmpt.restoreMock();
            loadingCtrl.restoreMock();
            appAuth.resetMock();
            appSession.resetMock();
            errCtrl.resetMock();
            navCmpt.resetMock();
            loadingCtrl.resetMock();
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
        it('should have a login-card ', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#login-card'); 
            expect(card).not.toBeNull();
        });
        it('should have a form with 3 entries ', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#login-card');
            let inputs: NodeListOf<HTMLInputElement> = card.querySelectorAll('input'); 
            expect(inputs.length).toEqual(3);
            expect(inputs[0].getAttribute('id')).toEqual('username');
            expect(inputs[1].getAttribute('id')).toEqual('password');
            expect(inputs[2].getAttribute('id')).toEqual('login');
        });
        it('should have a form containing a text element ', async () => {
            await window.flush();
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#login-card');
            let text: HTMLElement = card.querySelector('p');
            expect(text).toBeDefined();
            expect(text.textContent).toEqual('Not registered? Create an account');
        });
        it('should return status 400 when server disconnected', async () => {
            await window.flush();
            appAuth.responseMock({status:400,message:'Application Server not connected'});
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
            expect(navCmpt.getPageMock()).toEqual('app-page');
        });
        it('should return status 200 when servers are connected', async () => {
            await window.flush();
            let server:any = {status:200,result:{server:true,dbserver:true}};
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
        });
        it('should return error message when username input not valid', async () => {
            await window.flush();
            await element.initMocks(mocks);
            await element.handleChangeUsername('jp');
            expect(errCtrl.getMessageMock()).toEqual(ERROR_USERNAME);                    
            let input:HTMLInputElement = element.querySelector('#username');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when username already exists in CouchDB', async () => {
            await window.flush();
            await element.initMocks(mocks);
            await element.handleChangeUsername('jpq');
            let input:HTMLInputElement = element.querySelector('#username');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should return error message when password input not valid', async () => {
            await window.flush();
            await element.initMocks(mocks);
            await element.handleChangePassword('jeep');
            expect(errCtrl.getMessageMock()).toEqual(ERROR_PASSWORD);                    
            let input:HTMLInputElement = element.querySelector('#password');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when password is valid', async () => {
            await window.flush();
            await element.initMocks(mocks);
            await element.handleChangePassword('Test12');
            let input:HTMLInputElement = element.querySelector('#password');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should go to page /register when creating an account', async () => {
            await window.flush();
            await element.initMocks(mocks);
            await element.handleRegister('a');
            expect(navCmpt.getPageMock()).toEqual('app-register');
        });
        it('should return status 401 when the username and or the password do not exist in couchDB', async () => {
            await window.flush();
            await element.initMocks(mocks);
            element.setUser('paul','Test13')
            await appAuth.responseMock({"status":401, "message":"Unauthorized: Invalid Username or Password"})
            await element.handleSubmit();
            expect(errCtrl.getMessageMock()).toEqual("Unauthorized: Invalid Username or Password");                    
        });
        it('should return status 200 when the username and or the password exist in couchDB', async () => {
            await window.flush();
            await element.initMocks(mocks);
            let session: Session = {
                user_id: 'jeep',
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
            }           
            element.setUser('jeep','Test12')
            appAuth.responseMock({"status":200,result:session})
            await element.handleSubmit();
            expect(navCmpt.getPageMock()).toEqual('app-home');
            expect(navCmpt.getDataMock()).toEqual({mode:'connected'});        
        });
    });
});
