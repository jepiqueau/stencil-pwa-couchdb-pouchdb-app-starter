import { TestWindow } from '@stencil/core/testing';

import { AppProfile } from './app-profile';
import NavCtrlMock from '../../../__mocks__/navcontroller';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';
import AppConnMock from '../../../__mocks__/app-connection';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import NavCmptMock from '../../../__mocks__/nav';

describe('app-profile', () => {
  describe('instance', () => {
    let window: TestWindow;
    let dom: Document;
    let navCtrl: any;
    beforeEach(async () => {
      window = new TestWindow();
      dom = window.document;
      navCtrl = new NavCtrlMock();

    });
    afterEach(async () => {
      window = null;
      dom = null;
      navCtrl = null;
    });
    it('should build', () => {
      expect(new AppProfile()).toBeTruthy();
    });
    it('should navigate to app-profile', async () => {
      let instance:any = new AppProfile();
      let element:any = dom.createElement('app-profile');
      let nav:any = await navCtrl.getNav();
      nav.setDomMock(dom); 
      nav.el.setAttribute('id','navId');
      expect(nav.el.getAttribute('id')).toEqual('navId');
      await dom.body.appendChild(nav.el);
      expect(dom.body.querySelector('#navId')).toBeTruthy();
      await dom.body.appendChild(element);
      instance.el = element;
      await nav.push('app-profile',{'name':'stencil'});
      expect(instance.el.name).toEqual('stencil')
    }); 

  });
  describe('rendering', () => {
    let element: any;
    let window: TestWindow;
    let appSession: any;
    let appPouchDB: any;
    let appAuth: any;
    let appConn:any;
    let errCtrl: any;
    let navCmpt: any;
    let loadingCtrl: any;
    let mocks: any;
    beforeEach(async () => {
      window = new TestWindow();
      element = await window.load({
        components: [AppProfile],
        html: '<app-profile></app-profile>'
      });
      appAuth = new AppAuthMock();
      appSession = new AppSessionMock();
      appPouchDB = new AppPouchDBMock();
      appConn = new AppConnMock();
      errCtrl = new ErrCtrlMock();
      loadingCtrl = new LoadingCtrlMock();
      navCmpt = new NavCmptMock();
      mocks = {
          authProvider:appAuth,
          sessionProvider:appSession,
          pouchDBProvider:appPouchDB,
          errorCtrl:errCtrl,
          loadingCtrl:loadingCtrl,
          navCmpt:navCmpt,
          connectionProvider: appConn 
      }
    });
    afterEach(async () => {
      window = null;
      element = null;
      appAuth.restoreMock();
      appSession.restoreMock();
      appPouchDB.restoreMock();
      appConn.restoreMock();
      errCtrl.restoreMock();
      navCmpt.restoreMock();
      loadingCtrl.restoreMock();
      appAuth.resetMock();
      appSession.resetMock();
      appPouchDB.resetMock();
      appConn.resetMock(); 
      errCtrl.resetMock();
      navCmpt.resetMock();
      loadingCtrl.resetMock();
      
    });
    it('should not render any content if there is not a match', async () => {
      await window.flush();
      expect(element.textContent).toEqual('');
    });    
    it('should work with a name passed', async () => {
      element.initMocks(mocks).then(async() => {
        element.name = 'stencil';
        await window.flush();
        const pElement = element.querySelector('ion-content p');
        expect(pElement.textContent).toEqual('Hello! My name is stencil. My name was passed in through a route param!');
      });
    });
  });
});