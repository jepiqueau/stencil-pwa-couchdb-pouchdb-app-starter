import { render, flush } from '@stencil/core/testing';
import { mockWindow, mockDocument } from '@stencil/core/testing';
import NavCtrlMock from '../../../__mocks__/navcontroller';
import PopoverCtrlMock from '../../../__mocks__/popovercontroller';
import { AppPopover } from './app-popover';

describe('app', () => {
  it('should build', () => {
    expect(new AppPopover()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: any;
    let win: Window;
    let dom: Document;
    let navCtrl: any;
    let popoverCtrl: any;
    let mocks: any;
    beforeEach(async () => {
      element = await render({
        components: [AppPopover],
        html: '<app-popover></app-popover>'
      });
      win = mockWindow();
      dom = mockDocument(win);
      navCtrl = new NavCtrlMock();
      popoverCtrl = new PopoverCtrlMock();
      mocks = {
        navCmpt:true,
        popoverCtrl:true
      }
    });
    it('should not display popover if no data provided', async () => {
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      expect(nav.el.getAttribute('id')).toEqual('navId');
      await dom.body.appendChild(nav.el);
      expect(dom.body.querySelector('#navId')).toBeTruthy();
      element.initMocks(mocks).then(async () => {
        await flush(element);
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
      const data = [{cmp:'app-news-create',value:'Create News'},
                    {cmp:'app-news-display',value:'Display News'}
                   ];
      element.initMocks(mocks).then(() => {
        element.setData(data).then(async () => {
          await flush(element);
          const list = element.querySelector('ion-list');
          expect(list).not.toBeNull();
        });
      });
    });
  });
});
