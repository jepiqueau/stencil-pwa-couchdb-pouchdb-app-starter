import { TestWindow } from '@stencil/core/testing';
import NavCmptMock from '../../../__mocks__/nav';
import MenuCtrlMock from '../../../__mocks__/menucontroller';
import AppConnMock from '../../../__mocks__/app-connection';
import PopoverCtrlMock from '../../../__mocks__/popovercontroller';
import NavCtrlMock from '../../../__mocks__/navcontroller';
import { AppMenu } from './app-menu';

describe('app-menu', () => {
    it('should build', () => {
        expect(new AppMenu()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let window: TestWindow;
        let dom: Document;
        let connProv: any;
        let navCmpt: any;
        let navCtrl: any;
        let menuCtrl: any;
        let popoverCtrl: any; 
        let mocks: any;
        beforeEach(async () => {
            window = new TestWindow();
            dom = window.document;
            element = await window.load({
                components: [AppMenu],
                html: '<app-menu></app-menu>'
            });
            navCtrl = new NavCtrlMock();
            navCmpt = new NavCmptMock();
            connProv = new AppConnMock();
            menuCtrl = new MenuCtrlMock();
            popoverCtrl = new PopoverCtrlMock();
            mocks = {
                popoverCtrl: popoverCtrl,
                connectionProvider:connProv,
                menuCtrl:menuCtrl,
                navCmpt:navCmpt
            }
        });
        afterEach(async () => {
            window = null;
            dom = null;
            navCtrl.restoreMock();
            navCmpt.restoreMock();
            connProv.restoreMock();
            menuCtrl.restoreMock();
            popoverCtrl.restoreMock();
            navCtrl.resetMock();
            navCmpt.resetMock();
            connProv.resetMock();
            menuCtrl.resetMock();
            popoverCtrl.resetMock();
        });
        it('should have a ion-menu element', async () => {
            await window.flush();
            let menu: HTMLIonMenuElement = element.querySelector('ion-menu');
            expect(menu).toBeTruthy();
        });
        it('should have a ion-nav as content of a ion-menu', async () => {
            let menu: HTMLIonMenuElement = element.querySelector('ion-menu');
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            await window.flush();
            let contentId:string = menu.getAttribute('contentId');
            let navId:string = nav.el.getAttribute('id')
            expect(navId).toEqual(contentId);
        });
        it('should have a list of menu items', async () => {
            await window.flush();
            let list:HTMLIonListElement = element.querySelector('#menu-items');
            expect(list).toBeTruthy();
        });
        it('should contain three items', async () => {
            await window.flush();
            let items:Array<HTMLIonItemElement> = element.querySelectorAll('ion-item');
            expect(items).toBeTruthy();
            expect(items.length).toEqual(3);
            expect(items[0].textContent).toEqual('Home');
            expect(items[1].textContent).toEqual('Profile');
            expect(items[2].textContent).toEqual('News');
        });
        it('should push to the home page', async (done) => {
            await window.flush();
            navCmpt.setDomMock(dom);
            connProv.setConnection('offline');
            element.initMocks(mocks).then(async () => {
                await window.flush();
                let items:Array<HTMLIonButtonElement> = element.querySelectorAll('ion-item');
                items[0].click();
                await window.flush();
                expect(navCmpt.getPageMock()).toEqual('app-home');
                done();
            });
        });
        it('should push to the profile page', async (done) => {
            await window.flush();
            navCmpt.setDomMock(dom);
            element.initMocks(mocks).then(async () => {
                await window.flush();
                let items:Array<HTMLIonButtonElement> = element.querySelectorAll('ion-item');
                items[1].click();
                await window.flush();
                expect(navCmpt.getPageMock()).toEqual('app-profile');
                done();
            });
        });
        it('should present the News popover', async (done) => {
            await window.flush();
            navCmpt.setDomMock(dom);
            element.initMocks(mocks).then(async () => {
                await window.flush();
                let items:Array<HTMLIonButtonElement> = element.querySelectorAll('ion-item');
                items[2].click();
                await window.flush();
                expect((await popoverCtrl.getPopoversMock()).length).toEqual(1);
                let popEl = await popoverCtrl.getPopoverMock(1);
                expect(popEl.component).toEqual('app-popover');
                expect(popEl.componentProps.data[0].cmp).toEqual('app-news-create');
                expect(popEl.componentProps.data[0].value).toEqual("News Create");
                expect(popEl.componentProps.data[1].cmp).toEqual('app-news-display');
                expect(popEl.componentProps.data[1].value).toEqual("News Display");
                done();
            });
        });
    });
});
