import { flush, render } from '@stencil/core/testing';
import { mockWindow, mockDocument } from '@stencil/core/testing';
import { AppHeader} from './app-header';
import AppAuthMock from '../../../__mocks__/app-auth';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import NavCmptMock from '../../../__mocks__/nav';
import NavCtrlMock from '../../../__mocks__/navcontroller';

describe('app-header', () => {
    it('should build', () => {
        expect(new AppHeader()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let spy: jest.SpyInstance<any>;
        let authProv:any
        let errCtrl:any
        let navCmpt:any;
        let navCtrl:any;
        let mocks:any
        let win: Window;
        let dom: Document;
        beforeEach(async () => {
            element = await render({
                components: [AppHeader],
                html: '<app-header></app-header>'
            });
            win = mockWindow();
            dom = mockDocument(win);
            authProv = new AppAuthMock();
            errCtrl = new ErrCtrlMock();
            navCmpt = new NavCmptMock();
            navCtrl = new NavCtrlMock();
            mocks = {
                authProvider : authProv,
                errorCtrl : errCtrl,
                navCmpt: navCmpt
            };
        });
        afterEach(() => {
            authProv.restoreMock();
            errCtrl.restoreMock();
            navCmpt.restoreMock();
            navCtrl.restoreMock();
            authProv.resetMock();
            errCtrl.resetMock();
            navCmpt.resetMock();
            navCtrl.resetMock();
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
            let button: HTMLElement = element.querySelector('ion-buttons');
            expect(button).toBeNull();
        });
        it('should render the logout button when the logout property is specified', async () => {
            element.logout = true;
            await flush(element);
            let button: HTMLElement = element.querySelector('ion-buttons');
            expect(button).not.toBeNull();
        });
        it('should not render the menu toggle button when no menu property', async () => {
            await flush(element);
            let button: HTMLElement = element.querySelector('ion-menu-button');
            expect(button).toBeNull();
        });
        it('should render the menu toggle button when the logout property is specified', async () => {
            element.menu = true;
            await flush(element);
            let button: HTMLElement = element.querySelector('ion-menu-button');
            expect(button).not.toBeNull();
        });
        it('should not render the back button when no back property', async () => {
            await flush(element);
            let button: HTMLElement = element.querySelector('.back-button');
            expect(button).toBeNull();
        });
        it('should render the back button when back property', async () => {
            element.back = true;
            await flush(element);
            let button: HTMLElement = element.querySelector('.back-button');
            expect(button).not.toBeNull();
        });
        it('should not render the back button when menu property', async () => {
            element.menu = true;
            element.back = true;
            await flush(element);
            let button: HTMLElement = element.querySelector('.back-button');
            expect(button).toBeNull();
        });
        it('should call the app-auth logout function', async () => {
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            await dom.body.appendChild(nav.el);
            authProv.responseMock({status:200 , success:'Logged out', session:true});
            spy = jest.spyOn(authProv, 'logout');
            await element.initMocks(mocks);
            await flush(element);
            element.handleLogout();
            expect(spy).toHaveBeenCalled();
            spy.mockReset();
            spy.mockRestore();
        });
        it('should pop to previous page when clicking the back button', async () => {
            element.back = true;
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            await dom.body.appendChild(nav.el);
            await nav.setRoot('app-news-display',{name:'stencil'});
            await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
            let pages: Array<any> = nav.getPagesMock();
            expect(pages.length).toEqual(2);
            await element.initMocks(mocks);
            await flush(element);
            element.handleBack();
            pages = nav.getPagesMock();
            expect(pages.length).toEqual(1);
            expect(pages[0].key).toEqual('app-news-display');
            expect(pages[0].value.page).toEqual('app-news-display');
            expect(pages[0].value.data).toEqual({name:'stencil'});     
            });
    });

});