import { mockElement } from '@stencil/core/testing';

export const mockGetEl = mockElement('app-session') as HTMLElement;
let currentSession : any = null;
export const mockGetCurrentSession = jest.fn().mockImplementation(() => {
    return currentSession;
});
export const mockSaveSessionData = jest.fn().mockImplementation((data) => {
    currentSession = data;
});
export const mockGetSessionData = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        resolve(currentSession);
    });
});
export const mockRemoveSessionData = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        currentSession = null;
        resolve();
    });
});
export const restoreMock = jest.fn().mockImplementation(() => {
    currentSession = null;
});

export const resetMock = jest.fn().mockReset();

const mockSessionProvider = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        saveSessionData: mockSaveSessionData,
        getSessionData : mockGetSessionData,
        removeSessionData: mockRemoveSessionData,
        getCurrentSession: mockGetCurrentSession,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockSessionProvider;
