import { render, flush } from '@stencil/core/testing';
import { mockWindow, mockDocument } from '@stencil/core/testing';
import { AppHome } from './app-home';
import NavCmptMock from '../../../__mocks__/nav';
import MenuCtrlMock from '../../../__mocks__/menucontroller';
import AppConnMock from '../../../__mocks__/app-connection';
import NavCtrlMock from '../../../__mocks__/navcontroller';

describe('app', () => {
  it('should build', () => {
    expect(new AppHome()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: any;
    let page: HTMLElement;
    let connProv: any;
    let navCmpt: any;
    let navCtrl: any;
    let menuCtrl: any;
    let mocks: any;
    let win: Window;
    let dom: Document;

    beforeEach(async () => {
      element = await render({
        components: [AppHome],
        html: '<app-home></app-home>'
      });
      win = mockWindow();
      dom = mockDocument(win);
      navCmpt = new NavCmptMock();
      connProv = new AppConnMock();
      menuCtrl = new MenuCtrlMock();
      navCtrl = new NavCtrlMock();
      mocks = {
        connectionProvider:connProv,
        menuCtrl:menuCtrl,
        navCmpt:navCmpt
      }
    });
    afterEach(async () => {
      navCtrl.restoreMock();
      navCmpt.restoreMock();
      connProv.restoreMock();
      menuCtrl.restoreMock();
      navCtrl.resetMock();
      navCmpt.resetMock();
      connProv.resetMock();
      menuCtrl.resetMock();
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
    it('should have an app-logo component', async () => {
        await flush(element);
        page = element.querySelector('ion-page');
        let content: HTMLElement = page.querySelector('ion-content');
        let logo: HTMLElement = content.querySelector('app-logo');
        expect(logo).not.toBeNull();
    });
    it('should have an app-header component with a menu property', async () => {
      await flush(element);
      page = element.querySelector('ion-page');
      let header: HTMLElement = page.querySelector('app-header');
      expect(header.getAttribute('menu')).not.toBeNull();
    });
    it('should have an app-header component without a logout property', async () => {
      await flush(element);
      page = element.querySelector('ion-page');
      let header: HTMLElement = page.querySelector('app-header');
      expect((header.getAttribute('logout') === 'true')).toBeFalsy();
    });
    it('should have an app-header component with a logout property if server connected', async (done) => {
      await flush(element);
      connProv.setConnection('connected');
      expect(await connProv.getConnection()).toEqual('connected');
      element.initMocks(mocks).then(() => {
        element.setConMode().then(async () => {
          await flush(element);

          page = element.querySelector('ion-page');
          let header: HTMLElement = page.querySelector('app-header');

          expect(header.getAttribute('logout')).not.toBeNull();
          done();
        }); 
      });
    });
    it('should display the menu when clicking on the Menu button', async (done) => {
      await flush(element);
      let res = await menuCtrl.open('menu');
      expect(res).toBeTruthy();
      let menu:any = await menuCtrl.get('menu');
      menu.el.classList.add('show-menu');
      await dom.body.appendChild(menu.el);    
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      nav.el.classList.add('menu-content-open');
      await dom.body.appendChild(nav.el);
      element.initMocks(mocks).then(() => {
        element.handleToggleMenu();
          let menuEl: HTMLIonMenuElement = dom.querySelector('ion-menu');
          expect(menuEl).toBeTruthy();
          expect(menuEl.classList.contains('show-menu')).toBeTruthy();
          let navEl: HTMLElement = dom.body.querySelector('#navId');
          expect(navEl.classList.contains('menu-content-open')).toBeTruthy();
          done();
      });
    });
  });
});