import { TestWindow } from '@stencil/core/testing';
import { AppMain } from './app-main';

describe('app-main', () => {
    it('should build', () => {
        expect(new AppMain()).toBeTruthy();
    });
    describe('rendering', () => {
        let router: any;
        let window: TestWindow;
        let element: any;
        beforeEach(async () => {
          window = new TestWindow();
          element = await window.load({
                  components: [AppMain],
              html: '<app-main></app-main>'
            });
            router = element.querySelector('ion-router');
        });
        afterEach(async () => {
            window = null;
        });
        it('should have a stencil router element', async () => {
            await window.flush();
            expect(router).toBeTruthy();
        });
        it('should have nine route elements', async () => {
            await window.flush();
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes.length).toEqual(9);
            expect(routes[0].getAttribute('component')).toEqual('app-page');
            expect(routes[1].getAttribute('component')).toEqual('app-login');
            expect(routes[2].getAttribute('component')).toEqual('app-register');
            expect(routes[3].getAttribute('component')).toEqual('app-home');
            expect(routes[4].getAttribute('component')).toEqual('app-news-create');
            expect(routes[5].getAttribute('component')).toEqual('app-files-selection');
            expect(routes[6].getAttribute('component')).toEqual('app-news-display');
            expect(routes[7].getAttribute('component')).toEqual('app-news-item');
            expect(routes[8].getAttribute('component')).toEqual('app-profile');
        });
        it('should have a route to app-page as first page', async () => {
            await window.flush();
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes[0].getAttribute('component')).toEqual('app-page');
        });
        it('should have a route to app-login', async () => {
            await window.flush();
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes[1].getAttribute('component')).toEqual('app-login');
        });
        it('should have a route to app-register', async () => {
            await window.flush();
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes[2].getAttribute('component')).toEqual('app-register');
        });
        it('should have a route to app-home', async () => {
            await window.flush();
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
          expect(routes[3].getAttribute('component')).toEqual('app-home');
        });
        it('should have a ion-nav component', async () => {
            await window.flush();
            let nav: HTMLIonNavElement = element.querySelector('ion-nav');
            expect(nav).toBeDefined();
            expect(nav.getAttribute('id')).toEqual('navId');
        });
        it('should have a ion-popover-controller component', async () => {
            await window.flush();
            let popCtrl: HTMLIonPopoverControllerElement = element.querySelector('ion-popover-controller');
            expect(popCtrl).toBeDefined();
        });
        it('should have an app-menu web commponent', async () => {
            await window.flush();
            let menu: HTMLElement = element.querySelector('app-menu');
            expect(menu).toBeDefined();
        });
        it('should have an app-auth web commponent', async () => {
            await window.flush();
            let auth: HTMLElement = element.querySelector('app-auth');
            expect(auth).toBeDefined();
        });
        it('should have an app-error web commponent', async () => {
            await window.flush();
            let error: HTMLElement = element.querySelector('app-error');
            expect(error).toBeDefined();
        });
        it('should have an app-session web commponent', async () => {
            await window.flush();
            let session: HTMLElement = element.querySelector('app-session');
            expect(session).toBeDefined();
        });
        it('should have an app-pouchdb web commponent', async () => {
            await window.flush();
            let pouchdb: HTMLElement = element.querySelector('app-pouchdb');
            expect(pouchdb).toBeDefined();
        });
        it('should have an app-connection web commponent', async () => {
            await window.flush();
            let conn: HTMLElement = element.querySelector('app-connection');
            expect(conn).toBeDefined();
        });
    });
});