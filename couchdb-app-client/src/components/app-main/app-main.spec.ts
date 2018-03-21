import { render, flush } from '@stencil/core/testing';
import { AppMain } from './app-main';

describe('app-main', () => {
    it('should build', () => {
        expect(new AppMain()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let router: any;
        beforeEach(async () => {
            element = await render({
              components: [AppMain],
              html: '<app-main></app-main>'
            });
            router = element.querySelector('ion-router');
        });
        it('should have a stencil router element', async () => {
            await flush(element);
            expect(router).toBeTruthy();
        });
        it('should have seven route elements', async () => {
            await flush(element);
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes.length).toEqual(8);
            expect(routes[0].getAttribute('path')).toEqual('/');
            expect(routes[1].getAttribute('path')).toEqual('/login');
            expect(routes[2].getAttribute('path')).toEqual('/register');
            expect(routes[3].getAttribute('path')).toEqual('/home');
            expect(routes[4].getAttribute('path')).toEqual('/news/create');
            expect(routes[5].getAttribute('path')).toEqual('/news/display');
        });
        it('should have a route to app-page as first page', async () => {
            await flush(element);
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes[0].getAttribute('path')).toEqual('/');
            expect(routes[0].getAttribute('component')).toEqual('app-page');
        });
        it('should have a route to app-login', async () => {
            await flush(element);
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes[1].getAttribute('path')).toEqual('/login');
            expect(routes[1].getAttribute('component')).toEqual('app-login');
        });
        it('should have a route to app-register', async () => {
            await flush(element);
            let routes:HTMLCollection = router.querySelectorAll('ion-route');
            expect(routes[2].getAttribute('path')).toEqual('/register');
            expect(routes[2].getAttribute('component')).toEqual('app-register');
        });
        it('should have a route to app-home', async () => {
          await flush(element);
          let routes:HTMLCollection = router.querySelectorAll('ion-route');
          expect(routes[3].getAttribute('path')).toEqual('/home');
          expect(routes[3].getAttribute('component')).toEqual('app-home');
        });
        it('should have a ion-nav component', async () => {
            await flush(element);
            let nav: HTMLIonNavElement = element.querySelector('ion-nav');
            expect(nav).toBeDefined();
            expect(nav.getAttribute('id')).toEqual('navId');
        });
        it('should have a ion-popover-controller component', async () => {
            await flush(element);
            let popCtrl: HTMLIonPopoverControllerElement = element.querySelector('ion-popover-controller');
            expect(popCtrl).toBeDefined();
        });
        it('should have an app-menu web commponent', async () => {
            await flush(element);
            let menu: HTMLElement = element.querySelector('app-menu');
            expect(menu).toBeDefined();
        });
        it('should have an app-auth web commponent', async () => {
            await flush(element);
            let auth: HTMLElement = element.querySelector('app-auth');
            expect(auth).toBeDefined();
        });
        it('should have an app-error web commponent', async () => {
            await flush(element);
            let error: HTMLElement = element.querySelector('app-error');
            expect(error).toBeDefined();
        });
        it('should have an app-session web commponent', async () => {
            await flush(element);
            let session: HTMLElement = element.querySelector('app-session');
            expect(session).toBeDefined();
        });
        it('should have an app-pouchdb web commponent', async () => {
            await flush(element);
            let pouchdb: HTMLElement = element.querySelector('app-pouchdb');
            expect(pouchdb).toBeDefined();
        });
        it('should have an app-connection web commponent', async () => {
            await flush(element);
            let conn: HTMLElement = element.querySelector('app-connection');
            expect(conn).toBeDefined();
        });
    });
});