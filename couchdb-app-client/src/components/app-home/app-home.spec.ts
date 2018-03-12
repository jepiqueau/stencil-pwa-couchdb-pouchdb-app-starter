import { render, flush } from '@stencil/core/testing';
import { AppHome } from './app-home';

describe('app', () => {
  it('should build', () => {
    expect(new AppHome()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: any;
    let page: HTMLElement;
    beforeEach(async () => {
      element = await render({
        components: [AppHome],
        html: '<app-home></app-home>'
      });
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
  it('should have an app-menu component', async () => {
    await flush(element);
    page = element.querySelector('ion-page');
    let menu: HTMLElement = page.querySelector('app-menu');
    expect(menu).not.toBeNull();
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

  });
});