import { flush, render } from '@stencil/core/testing';
import { AppHeader} from './app-header';
import AppAuthMock from '../../../__mocks__/app-auth';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';

describe('app-header', () => {
    it('should build', () => {
        expect(new AppHeader()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let spy: jest.SpyInstance<any>;
        let authProv:any
        let errCtrl:any
        beforeEach(async () => {
            element = await render({
                components: [AppHeader],
                html: '<app-header></app-header>'
            });
            authProv = new AppAuthMock();
            errCtrl = new ErrCtrlMock();
        });
        afterEach(() => {
            authProv.restoreMock();
            errCtrl.restoreMock();
            authProv.resetMock();
            errCtrl.resetMock();
            authProv = null;
            errCtrl = null;
        });
        it('should work without a title', async () => {
            await flush(element);
            let title: HTMLElement = element.querySelector('ion-title');
            expect(title.textContent).toEqual('Stencil PouchDB App');
        });
        it('should work with a title', async () => {
            element.htitle = "Hello World!";
            await flush(element);
            let titleEl: HTMLElement = element.querySelector('ion-title');
            expect(titleEl.textContent).toEqual('Hello World!');
        });  
        it('should not render the logout button when no logout property', async () => {
            await flush(element);
            let buttons: HTMLElement = element.querySelector('ion-buttons');
            expect(buttons).toBeNull();
        });
        it('should render the logout button when the logout property is specified', async () => {
            element.logout = true;
            await flush(element);
            let buttons: HTMLElement = element.querySelector('ion-buttons');
            expect(buttons).not.toBeNull();
        });
        it('should call the app-auth logout function', async () => {
            authProv.responseMock({status:200 , success:'Logged out', session:true});
            spy = jest.spyOn(authProv, 'logout');
            let mocks:any = {authProvider : authProv, errorCtrl : errCtrl};
            await element.initMocks(mocks);
            await flush(element);
            element.handleLogout();
            expect(spy).toHaveBeenCalled();
            spy.mockReset();
            spy.mockRestore();
        });
    });

});