import { mockElement } from './mock';

export const mockGetEl = mockElement('ion-popover') as HTMLElement;

export let component : string = null;
export let ev :any = null;
export let componentProps: any = null;

export const mockPresent = jest.fn().mockImplementation((): Promise<void> => {
    return Promise.resolve();
});
export const mockDismiss = jest.fn().mockImplementation((): Promise<void> => {
    component = null;
    ev = null;
    componentProps = null;
    return Promise.resolve();
});
export const restoreMock = jest.fn().mockImplementation(() => {
    component = null;
    ev = null;
    componentProps = null;
});

export const resetMock = jest.fn().mockReset();

const mockPopover = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        component: component,
        componentProps: componentProps,
        ev: ev,
        present: mockPresent,
        dismiss: mockDismiss,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockPopover;
