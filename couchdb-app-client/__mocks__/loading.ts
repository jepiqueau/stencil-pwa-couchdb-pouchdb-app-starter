let message:string;
export const mockPresent = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        resolve(message);
    });
});
export const mockDismiss = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        message = null;
        resolve();
    });
});
export const mockSetContent = jest.fn().mockImplementation((msg:string) => {
    message = msg;
});
export const mockGetContent = jest.fn().mockImplementation(() => {
    return message;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    message = null;
});

export const resetMock = jest.fn().mockReset();

const mockLoading = jest.fn().mockImplementation(() => {
    return {
        present: mockPresent,
        dismiss: mockDismiss,
        setContentMock: mockSetContent,
        getContentMock: mockGetContent,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockLoading;
