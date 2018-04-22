import { TestWindow } from '@stencil/core/testing';
import { AppLogo} from './app-logo';

describe('app-logo', () => {
    it('should build', () => {
        expect(new AppLogo()).toBeTruthy();
    });

    describe('rendering', () => {
        let window: TestWindow;
        let element;
        beforeEach(async () => {
            window = new TestWindow();
            element = await window.load({
                components: [AppLogo],
                html: '<app-logo></app-logo>'
            });
        });
        afterEach(async () => {
            window = null;
        });
        it('should display a card element', async () => {
            window.flush();
            let card: HTMLElement = element.querySelector('.card');
            expect(card).not.toBeNull();
        }); 
        it('should display a SVG element', async () => {
            window.flush();
            let svg: HTMLElement = element.querySelector('svg');
            expect(svg).not.toBeNull();
        });
        it('should work without a width property', async () => {
            window.flush();
            let card: HTMLElement = element.querySelector('.card');
            expect(card).not.toBeNull();
            expect(card.getAttribute('style')).toEqual('width: 100%;');
        });
        it('should work with a width property of 75%', async () => {
            element.width = '75%';           
            window.flush();
            let card: HTMLElement = element.querySelector('.card');
            expect(card).not.toBeNull();
            expect(card.getAttribute('style')).toEqual('width: 75%;');
        });
        
    });
});