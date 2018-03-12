let message:string = null;

export const mockPresent = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        resolve(message);
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

const mockToast = jest.fn().mockImplementation(() => {
    return {
        present: mockPresent,
        setContent : mockSetContent,
        getContentMock : mockGetContent,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockToast;
