import { flush, render } from '@stencil/core/testing';
import { mockWindow, mockDocument } from '@stencil/core/testing';
import { AppProfile } from './app-profile';
import NavCtrlMock from '../../../__mocks__/navcontroller';

describe('app-profile', () => {
  it('should build', () => {
    expect(new AppProfile()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: any;
    let win: Window;
    let dom: Document;
    let navCtrl: any;
    beforeEach(async () => {
      element = await render({
        components: [AppProfile],
        html: '<app-profile></app-profile>'
      });
      win = mockWindow();
      dom = mockDocument(win);
      navCtrl = new NavCtrlMock();
    });

    it('should not render any content if there is not a match', async () => {
      await flush(element);
      expect(element.textContent).toEqual('');
    })

    it('should work with a name passed', async () => {
      let nav:any = await navCtrl.getNav(); 
      nav.el.setAttribute('id','navId');
      expect(nav.el.getAttribute('id')).toEqual('navId');
      await dom.body.appendChild(nav.el);
      expect(dom.body.querySelector('#navId')).toBeTruthy();
      await nav.push('app-stencil',{'name':'stencil'}); 
      expect(nav.getActive().data['name']).toEqual('stencil');
      element.getNavData(nav);
      await flush(element);

      const pElement = element.querySelector('ion-content p');

      expect(pElement.textContent).toEqual('Hello! My name is stencil. My name was passed in through a route param!');
    });
  });
});