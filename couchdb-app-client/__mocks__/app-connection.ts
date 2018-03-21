import { mockElement } from '@stencil/core/testing';

export const mockGetEl = mockElement('app-connection') as HTMLElement;
let connection : string = null;
export const mockSetConnection = jest.fn().mockImplementation((data) => {
    connection = data;
});
export const mockGetConnection = jest.fn().mockImplementation((): Promise<string> => {
    return Promise.resolve(connection);
});
export const restoreMock = jest.fn().mockImplementation(() => {
    connection = null;
});

export const resetMock = jest.fn().mockReset();

const mockConnectionProvider = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        setConnection: mockSetConnection,
        getConnection : mockGetConnection,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockConnectionProvider;
