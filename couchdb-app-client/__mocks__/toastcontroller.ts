import { mockElement } from './mock';
import ToastMock from './toast';

export const mockGetEl = mockElement('ion-toast-controller') as HTMLElement;

let toast: any = null;

export const mockCreate = jest.fn().mockImplementation((message, duration) => {
    return new Promise((resolve ) => {
        toast = new ToastMock();
        toast.setContent(message,duration);
        resolve(toast);
    });
});
export const getToastMock = jest.fn().mockImplementation(() => {
    return toast;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    toast  = null;
});
export const resetMock = jest.fn().mockReset();

const mockToastController = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        create: mockCreate,
        getToastMock: getToastMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockToastController;
