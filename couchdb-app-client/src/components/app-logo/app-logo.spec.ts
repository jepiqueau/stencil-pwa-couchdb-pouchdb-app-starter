import { flush, render } from '@stencil/core/testing';
import { AppLogo} from './app-logo';

describe('app-logo', () => {
    it('should build', () => {
        expect(new AppLogo()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        beforeEach(async () => {
            element = await render({
                components: [AppLogo],
                html: '<app-logo></app-logo>'
            });
        });
        it('should display a card element', async () => {
            await flush(element);
            let card: HTMLElement = element.querySelector('.card');
            expect(card).not.toBeNull();
        }); 
        it('should display a SVG element', async () => {
            await flush(element);
            let svg: HTMLElement = element.querySelector('svg');
            expect(svg).not.toBeNull();
        });
        it('should work without a width property', async () => {
            await flush(element);
            let card: HTMLElement = element.querySelector('.card');
            expect(card).not.toBeNull();
            expect(card.getAttribute('style')).toEqual('width: 100%;');
        });
        it('should work with a width property of 75%', async () => {
            element.width = '75%';           
            await flush(element);
            let card: HTMLElement = element.querySelector('.card');
            expect(card).not.toBeNull();
            expect(card.getAttribute('style')).toEqual('width: 75%;');
        });
        
    });
});