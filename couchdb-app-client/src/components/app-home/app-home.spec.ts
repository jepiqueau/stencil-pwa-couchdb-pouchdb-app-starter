import { TestWindow } from '@stencil/core/testing';
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
    let window: TestWindow;
    let dom: Document;
    beforeEach(async () => {
      window = new TestWindow();
      element = await window.load({
        components: [AppHome],
        html: '<app-home></app-home>'
      });
      dom = window.document;
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
      window = null;
      dom = null;
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
    it('should have an app-header component with a menu property', async () => {
      await window.flush();
      page = element.querySelector('ion-page');
      let header: HTMLElement = page.querySelector('app-header');
      expect(header.getAttribute('menu')).not.toBeNull();
    });
    it('should have an app-header component without a logout property', async () => {
      await window.flush();
      page = element.querySelector('ion-page');
      let header: HTMLElement = page.querySelector('app-header');
      expect(header.getAttribute('logout')).toEqual('false');
    });
    it('should have an app-header component with a logout property when mode property setted', async () => {
      element.mode='connected';
      await window.flush();
      mocks = {
        menuCtrl:menuCtrl,
        navCmpt:navCmpt
      }
      element.initMocks(mocks).then(() => {
        let comps:any = element.getComps();
        
        element.setConMode().then( async () => {
          await window.flush();
          page = element.querySelector('ion-page');
          let header: HTMLElement = page.querySelector('app-header');
          expect(header.getAttribute('logout')).toBeTruthy();
        });
      });
    });
    it('should have an app-header component with a logout property if server connected', async (done) => {
      await window.flush();
      connProv.setConnection('connected');
      expect(await connProv.getConnection()).toEqual('connected');
      element.initMocks(mocks).then(() => {
        element.setConMode().then(async () => {
          await window.flush();

          page = element.querySelector('ion-page');
          let header: HTMLElement = page.querySelector('app-header');
          expect(header.getAttribute('logout')).toBeTruthy();
          done();
        }); 
      });
    });
    it('should display the menu when clicking on the Menu button', async (done) => {
      await window.flush();
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
          let butEl: HTMLElement = element.querySelector('.menu-button');
          butEl.dispatchEvent(new window.Event('click'));
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