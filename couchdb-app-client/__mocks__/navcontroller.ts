import { mockElement } from '@stencil/core/testing';
import NavMock from './nav';
let nav: any = null;


export const getNav = jest.fn().mockImplementation(() => {
    nav = new NavMock() as any;
    nav.el = mockElement('ion-nav') as HTMLIonNavElement;
    nav.el.classList.add('menu-content')
    nav.ionNavChanged = {emit: function() { return; } };
    return nav;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    nav = null;
});
export const resetMock = jest.fn().mockReset();

const mockNavController = jest.fn().mockImplementation(() => {
    return {
        getNav : getNav,
        restoreMock : restoreMock,
        resetMock: resetMock
    };
});

export default mockNavController;

