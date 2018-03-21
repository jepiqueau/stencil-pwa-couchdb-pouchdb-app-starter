import { render, flush } from '@stencil/core/testing';
import { mockWindow, mockDocument } from '@stencil/core/testing';
import NavCtrlMock from '../../../__mocks__/navcontroller';
import { AppMenu } from './app-menu';

describe('app-menu', () => {
    it('should build', () => {
        expect(new AppMenu()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let win: Window;
        let dom: Document;
        let navCtrl: any;
            beforeEach(async () => {
            element = await render({
              components: [AppMenu],
              html: '<app-menu></app-menu>'
            });
            win = mockWindow();
            dom = mockDocument(win);
            navCtrl = new NavCtrlMock();
        });
        it('should have a ion-menu element', async () => {
            await flush(element);
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
                  await flush(element);
            let contentId:string = menu.getAttribute('contentId');
            let navId:string = nav.el.getAttribute('id')
            expect(navId).toEqual(contentId);
        });
        it('should have a list of menu items', async () => {
            await flush(element);
            let list:HTMLIonListElement = element.querySelector('#menu-items');
            expect(list).toBeTruthy();
        });
        it('should contain three items', async () => {
            await flush(element);
            let items:Array<HTMLIonItemElement> = element.querySelectorAll('ion-item');
            expect(items).toBeTruthy();
            expect(items.length).toEqual(3);
            expect(items[0].textContent).toEqual('Home');
            expect(items[1].textContent).toEqual('Profile');
            expect(items[2].textContent).toEqual('News');
        });
    });
});
