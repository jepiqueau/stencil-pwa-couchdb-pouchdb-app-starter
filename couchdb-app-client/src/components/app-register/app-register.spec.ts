import { flush, render } from '@stencil/core/testing';
import { AppRegister} from './app-register';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import HistoryRouterMock from '../../../__mocks__/historyrouter';
import { Session } from '../../global/interfaces';
import { ERROR_NAME, ERROR_EMAIL, ERROR_USERNAME, ERROR_PASSWORD } from '../../global/constants';

let appSession: any;
let appAuth: any;
let errCtrl: any;
let history: any;
let loadingCtrl: any;
describe('app-register', () => {
    it('should build', () => {
        expect(new AppRegister()).toBeTruthy();
    });
    describe('rendering', () => {
        let element: any;
        let mocks:any;
        let page: HTMLElement;
        let session: Session;
        beforeEach(async () => {
            element = await render({
                components: [AppRegister],
                html: '<app-register></app-register>'
            });
            appAuth = new AppAuthMock();
            appSession = new AppSessionMock();
            errCtrl = new ErrCtrlMock();
            loadingCtrl = new LoadingCtrlMock();
            history = new HistoryRouterMock();
            mocks = {
                authProvider:appAuth,
                sessionProvider:appSession,
                errorCtrl:errCtrl,
                loadingCtrl:loadingCtrl,
                history:history 
            }
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
        afterEach(async() => {
            appAuth.restoreMock();
            appSession.restoreMock();
            errCtrl.restoreMock();
            history.restoreMock();
            loadingCtrl.restoreMock();
            appAuth.resetMock();
            appSession.resetMock();
            errCtrl.resetMock();
            history.resetMock();
            loadingCtrl.resetMock();
            appAuth = null;
            appSession = null;
            errCtrl = null;
            loadingCtrl = null;
            history = null;
            mocks = null;
        });
        it('should have a ion-page component', async () => {
            await flush(element);
            page = element.querySelector('ion-page');
            expect(page).not.toBeNull();
        });
        it('should have an app-header component', async () => {
            await flush(element);
            page = element.querySelector('ion-page');
            let header: HTMLElement = page.querySelector('app-header');
            expect(header).not.toBeNull();
        });
        it('should have an ion-content component', async () => {
            await flush(element);
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            expect(content).not.toBeNull();
        });
        it('should have a register-card ', async () => {
            await flush(element);
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#register-card'); 
            expect(card).not.toBeNull();
        });
        it('should have a form with 6 entries ', async () => {
            await flush(element);
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#register-card');
            let inputs: NodeListOf<HTMLInputElement> = card.querySelectorAll('input'); 
            expect(inputs.length).toEqual(6);
            expect(inputs[0].getAttribute('id')).toEqual('name');
            expect(inputs[1].getAttribute('id')).toEqual('email');
            expect(inputs[2].getAttribute('id')).toEqual('username');
            expect(inputs[3].getAttribute('id')).toEqual('password');
            expect(inputs[4].getAttribute('id')).toEqual('confirmPassword');
            expect(inputs[5].getAttribute('id')).toEqual('register');
        });
        it('should return status 400 when server disconnected', async () => {
            await flush(element);
            appAuth.responseMock({status:400,message:'Application Server not connected'});
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
            expect(history.getPathMock()).toEqual('/');
        });
        it('should return status 200 when servers are connected', async () => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
        });
        it('should return error message when name input not valid (length <3)', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangeName('Co',10);
            await flush(element);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_NAME);                    
            let input:HTMLInputElement = element.querySelector('#name');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return error message when name input not valid (length > 25)', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangeName('Juan Carlos Hernandez Lopez',10);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_NAME);                    
            let input:HTMLInputElement = element.querySelector('#name');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when name input is valid (3 < length > 25)', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangeName('Colin Smith',10);
            let input:HTMLInputElement = element.querySelector('#name');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should return error message when email input not valid (no @)', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangeEmail('jeep.com',10);
            await flush(element);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_EMAIL);                    
            let input:HTMLInputElement = element.querySelector('#email');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return error message when email input not valid (no . after @)', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangeEmail('jeep@example',10);
            await flush(element);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_EMAIL);                    
            let input:HTMLInputElement = element.querySelector('#email');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return error message when email input valid and already existing in CouchDB', async () => {
            await flush(element);
            appAuth.responseMock({"status":409, "message":"Conflict: Email already in use"})
            await element.initMocks(mocks);
            await element.handleChangeEmail('jeep@example.com',10);
            await flush(element);
            expect(errCtrl.getMessageMock()).toEqual("Conflict: Email already in use");                    
            let input:HTMLInputElement = element.querySelector('#email');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when email input valid and not existing in CouchDB', async () => {
            await flush(element);
            appAuth.responseMock({"status":200})
            await element.initMocks(mocks);
            await element.handleChangeEmail('jeep@example.com',10);
            await flush(element);
            let input:HTMLInputElement = element.querySelector('#email');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should return error message when username input not valid', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangeUsername('jp',10);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_USERNAME);                    
            let input:HTMLInputElement = element.querySelector('#username');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return error message when username input is valid and already existing in CouchDB', async () => {
            await flush(element);
            appAuth.responseMock({"status":409, "message":"Conflict: Username already in use"})
            await element.initMocks(mocks);
            await element.handleChangeUsername('jeep',10);
            expect(errCtrl.getMessageMock()).toEqual("Conflict: Username already in use");                    
            let input:HTMLInputElement = element.querySelector('#username');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when username input is valid and not existing in CouchDB', async () => {
            await flush(element);
            appAuth.responseMock({"status":200})
            await element.initMocks(mocks);
            await element.handleChangeUsername('jeep',10);
            let input:HTMLInputElement = element.querySelector('#username');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should return error message when password input not valid', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangePassword('jeep',10);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_PASSWORD);                    
            let input:HTMLInputElement = element.querySelector('#password');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when password is valid', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangePassword('Test12',10);
            let input:HTMLInputElement = element.querySelector('#password');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should return error message when confirm password input not valid', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangePassword('jeep',10);
            expect(errCtrl.getMessageMock()).toEqual(ERROR_PASSWORD);                    
            let input:HTMLInputElement = element.querySelector('#confirmPassword');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return error message when confirm password input valid and not equal to password', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangePassword('Test12',10);
            await element.handleChangeConfirmPassword('Test13',10);
            expect(errCtrl.getMessageMock()).toEqual('Password Mismatch');                    
            let input:HTMLInputElement = element.querySelector('#confirmPassword');
            expect(input.classList.contains('validated')).toBeFalsy();
        });
        it('should return successful when confirm password input valid and equal to password', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangePassword('Test12',10);
            await element.handleChangeConfirmPassword('Test12',10);
            let input:HTMLInputElement = element.querySelector('#confirmPassword');
            expect(input.classList.contains('validated')).toBeTruthy();
        });
        it('should return button visibility to false when not all inputs filled in', async () => {
            await flush(element);
            await element.initMocks(mocks);
            await element.handleChangePassword('Test12',10);
            await element.handleChangeConfirmPassword('Test12',10);
            let input:HTMLInputElement = element.querySelector('#confirmPassword');
            let button:HTMLInputElement = element.querySelector('#register');
            expect(input.classList.contains('validated')).toBeTruthy();
            expect(button.classList.contains('visible')).toBeFalsy();
        });
        it('should return button visibility to true when all inputs filled in', async () => {
            await flush(element);
            appAuth.responseMock({"status":200})
            await element.initMocks(mocks);
            await element.handleChangeName('Colin Smith',10);
            await element.handleChangeEmail('colinsmith@example.com',10);
            await element.handleChangeUsername('csmith',10);
            await element.handleChangePassword('Test12',10);
            await element.handleChangeConfirmPassword('Test12',10);
            let input:HTMLInputElement = element.querySelector('#confirmPassword');
            let button:HTMLInputElement = element.querySelector('#register');
            expect(input.classList.contains('validated')).toBeTruthy();
            expect(button.classList.contains('visible')).toBeTruthy();
        });
        it('should navigate to "Home" when clicking on "Create your account" button when all inputs filled in', async () => {
            await flush(element);
            appAuth.responseMock({status:200 , result:session});
            await appSession.saveSessionData(session);
            await element.initMocks(mocks);
            await element.handleChangeName('Colin Smith',10);
            await element.handleChangeEmail('colinsmith@example.com',10);
            await element.handleChangeUsername('csmith',10);
            await element.handleChangePassword('Test12',10);
            await element.handleChangeConfirmPassword('Test12',10);
            await element.handleSubmit();
            expect(history.getPathMock()).toEqual('/home/connected');
        });
        it('should display error when clicking on "Create your account" button when all inputs filled in and CouchDB error', async () => {
            await flush(element);
            appAuth.responseMock({status:400 , message:'Bad Request'});
            await appSession.saveSessionData(session);
            await element.initMocks(mocks);
            await element.handleChangeName('Colin Smith',10);
            await element.handleChangeEmail('colinsmith@example.com',10);
            await element.handleChangeUsername('csmith',10);
            await element.handleChangePassword('Test12',10);
            await element.handleChangeConfirmPassword('Test12',10);
            await element.handleSubmit();
            expect(errCtrl.getMessageMock()).toEqual("Bad Request");                    
        });
    });
});
