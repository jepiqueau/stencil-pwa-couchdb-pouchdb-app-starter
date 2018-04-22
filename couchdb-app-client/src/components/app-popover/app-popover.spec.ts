import { TestWindow } from '@stencil/core/testing';
import NavCtrlMock from '../../../__mocks__/navcontroller';
import PopoverCtrlMock from '../../../__mocks__/popovercontroller';
import NavCmptMock from '../../../__mocks__/nav';
import { AppPopover } from './app-popover';

describe('app', () => {
  it('should build', () => {
    expect(new AppPopover()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: any;
    let window: TestWindow;
    let dom: Document;
    let navCtrl: any;
    let popoverCtrl: any;
    let navCmpt: any;
    let mocks: any;
    beforeEach(async () => {
      window = new TestWindow();
      element = await window.load({
      components: [AppPopover],
        html: '<app-popover></app-popover>'
      });
      dom = window.document;
      navCtrl = new NavCtrlMock();
      popoverCtrl = new PopoverCtrlMock();
      navCmpt = new NavCmptMock();
      mocks = {
        navCmpt:navCmpt,
        popoverCtrl:popoverCtrl
      }
    });
    afterEach(async () => {
      navCmpt.restoreMock();
      navCtrl.restoreMock();
      popoverCtrl.restoreMock();
      navCmpt.resetMock();
      navCtrl.resetMock();
      popoverCtrl.resetMock();
      dom.body.innerHTML = "";
      window = null;
      dom = null;
    });

    it('should not display popover if no data provided', async () => {
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      expect(nav.el.getAttribute('id')).toEqual('navId');
      await dom.body.appendChild(nav.el);
      expect(dom.body.querySelector('#navId')).toBeTruthy();
      const event = { preventDefault: () => {} };
      const options:any ={component:'app-popover',
                          ev:event};
      let popover:any = await popoverCtrl.create(options);
      await popover.present();           
      element.initMocks(mocks).then(async () => {
        await window.flush();
        const list = element.querySelector('ion-list');
        expect(list).toBeNull();
      });
    });
    it('should display popover if data provided', async () => {
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      expect(nav.el.getAttribute('id')).toEqual('navId');
      await dom.body.appendChild(nav.el);
      expect(dom.body.querySelector('#navId')).toBeTruthy();
      const data = [{cmp:'app-news-create',value:'News Create'},
                    {cmp:'app-news-display',value:'News Display'}
                   ];
      const event = { preventDefault: () => {} };
      const options:any ={component:'app-popover',
                          componentProps:{data:data},
                          ev:event};
      let popover:any = await popoverCtrl.create(options);
      await popover.present(); 
      element.initMocks(mocks).then(() => {
        element.setData().then(async () => {
          await window.flush();
          const list:HTMLIonListElement = element.querySelector('ion-list');
          expect(list).not.toBeNull();
          expect(list.children.length).toEqual(3);
          expect(list.children[0].textContent).toEqual('News');
          expect(list.children[1].textContent).toEqual('News Create');
          expect(list.children[2].textContent).toEqual('News Display');
        });
      });
    });
    it('should load "app-create-news" when the user clicks on "News Create" item', async () => {
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      await dom.body.appendChild(nav.el);
      nav.setDomMock(dom);
      let page:any = dom.createElement('app-home');
      await dom.body.appendChild(page);
      await nav.setRoot('app-home',{mode:'offline'});
      page = dom.createElement('app-news-create');
      await dom.body.appendChild(page);
      const data = [{cmp:'app-news-create',value:'News Create'},
                    {cmp:'app-news-display',value:'News Display'}
                   ];
      const event = { preventDefault: () => {} };
      const options:any ={component:'app-popover',
                          componentProps:{data:data},
                          ev:event};
      let popover:any = await popoverCtrl.create(options);
      await popover.present(); 
      element.initMocks(mocks).then(() => {
        element.setData().then(async () => {
          await window.flush();
          const list:HTMLIonListElement = element.querySelector('ion-list');
          const items = list.querySelectorAll('ion-item')
          element.addEventListener('itemClick', async () => {
            let pops = await popoverCtrl.getPopoversMock();
            expect(pops.length).toEqual(0);
            expect(nav.getPageMock()).toEqual('app-news-create');
          });
          items[0].dispatchEvent(new window.Event('click'));
        });
      });
    });
     it('should load "app-display-news" when the user clicks on "News Display" item', async () => {
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      await dom.body.appendChild(nav.el);
      nav.setDomMock(dom);
      let page:any = dom.createElement('app-home');
      await dom.body.appendChild(page);
      await nav.setRoot('app-home',{mode:'offline'});
      page = dom.createElement('app-news-display');
      await dom.body.appendChild(page);
      const data = [{cmp:'app-news-create',value:'News Create'},
                    {cmp:'app-news-display',value:'News Display'}
                   ];
      const event = { preventDefault: () => {} };
      const options:any ={component:'app-popover',
                          componentProps:{data:data},
                          ev:event};
      let popover:any = await popoverCtrl.create(options);
      await popover.present(); 
      element.initMocks(mocks).then(() => {
        element.setData().then(async () => {
          await window.flush();
          const list:HTMLIonListElement = element.querySelector('ion-list');
          const items = list.querySelectorAll('ion-item')
          element.addEventListener('itemClick', async () => {
            let pops = await popoverCtrl.getPopoversMock();
            expect(pops.length).toEqual(0);
            expect(nav.getPageMock()).toEqual('app-news-display');
          });
          items[1].dispatchEvent(new window.Event('click'));
        });
      });
    });
  });
});
