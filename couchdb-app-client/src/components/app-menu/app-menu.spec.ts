import { render, flush } from '@stencil/core/testing';
import { AppMenu } from './app-menu';

describe('app-menu', () => {
    it('should build', () => {
        expect(new AppMenu()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let menu: any;
        let nav : any;
        beforeEach(async () => {
            element = await render({
              components: [AppMenu],
              html: '<app-menu></app-menu>'
            });
            menu = element.querySelector('ion-menu');
            nav = element.querySelector('ion-nav');
        });
        it('should have a ion-menu element', async () => {
            await flush(element);
            expect(menu).toBeTruthy();
        });
        it('should have a ion-nav element', async () => {
            await flush(element);
            expect(nav).toBeTruthy();
        });
        it('should have a ion-nav as content of a ion-menu', async () => {
            await flush(element);
            let contentId:string = menu.getAttribute('contentId');
            let navId:string = nav.getAttribute('id')
            expect(navId).toEqual(contentId);
        });
        it('should work without page property', async () => {
            await flush(element);
            let buttons: Array<HTMLButtonElement> = menu.querySelectorAll('ion-button');
            expect(buttons.length).toEqual(2);
            expect(buttons[0].textContent).toEqual('News');
            expect(buttons[1].textContent).toEqual('Profile');
        });
        it('should work with page property = "home"', async () => {
            element.page='home/connected';
            await flush(element);
            let buttons: Array<HTMLButtonElement> = menu.querySelectorAll('ion-button');
            expect(buttons.length).toEqual(2);
            expect(buttons[0].textContent).toEqual('News');
            expect(buttons[1].textContent).toEqual('Profile');
        });
        it('should work with page property = "news-create"', async () => {
            element.page='news-create/offline';
            element.handleClick();
            await flush(element);
            let buttons: Array<HTMLButtonElement> = menu.querySelectorAll('ion-button');
            expect(buttons.length).toEqual(3);
            expect(buttons[0].textContent).toEqual('Home');
            expect(buttons[1].textContent).toEqual('Profile');
            expect(buttons[2].textContent).toEqual('News Display');
        });
        it('should work with page property = "news-display"', async () => {
            element.page='news-display/connected';
            element.handleClick();
            await flush(element);
            let buttons: Array<HTMLButtonElement> = menu.querySelectorAll('ion-button');
            expect(buttons.length).toEqual(3);
            expect(buttons[0].textContent).toEqual('Home');
            expect(buttons[1].textContent).toEqual('Profile');
            expect(buttons[2].textContent).toEqual('News Create');
        });
        it('should work with page property = "profile"', async () => {
            element.page='profile';
            await flush(element);
            let buttons: Array<HTMLButtonElement> = menu.querySelectorAll('ion-button');
            expect(buttons.length).toEqual(2);
            expect(buttons[0].textContent).toEqual('Home');
            expect(buttons[1].textContent).toEqual('News');
        });
    });
});
