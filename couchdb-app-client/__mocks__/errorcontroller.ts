import { mockElement } from './mock';

export const mockGetEl = mockElement('app-error') as HTMLElement;
let message:string = null;

export const mockShowError = jest.fn().mockImplementation((msg:string) => {
    return new Promise((resolve ) => {
        message = msg;
        resolve();
    });
});
export const responseMock = jest.fn().mockImplementation((response:string) => {
    message = response;
});
export const getMessageMock = jest.fn().mockImplementation(() => {
    return message;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    message = null;
});
export const resetMock = jest.fn().mockReset();

const mockErrorController = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        showError: mockShowError,
        responseMock: responseMock,
        getMessageMock: getMessageMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockErrorController;
