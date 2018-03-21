import { mockElement } from '@stencil/core/testing';

export const mockGetEl = mockElement('ion-popover') as HTMLElement;

let component : string = null;
let ev :any = null;
let data: any = null;

export const mockPresent = jest.fn().mockImplementation((): Promise<void> => {
    return Promise.resolve();
});
export const mockDismiss = jest.fn().mockImplementation((): Promise<void> => {
    component = null;
    ev = null;
    data = null;
    return Promise.resolve();
});
export const setDataMock = jest.fn().mockImplementation((options?:any) => {
    let opt:any = options ? options : null;
    component = opt != null ? opt.component : null;
    ev = opt != null ? opt.ev : null;
    data = opt != null ? opt.data : {};
});
export const getDataMock = jest.fn().mockImplementation(():any => {
    return {component:component,data:data,ev:ev};
});
export const restoreMock = jest.fn().mockImplementation(() => {
    component = null;
    ev = null;
    data = null;
});

export const resetMock = jest.fn().mockReset();

const mockPopover = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        present: mockPresent,
        dismiss: mockDismiss,
        setDataMock: setDataMock,
        getDataMock: getDataMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockPopover;
