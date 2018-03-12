let connection : any = null;
export const mockSetConnection = jest.fn().mockImplementation((data) => {
    connection = data;
});
export const mockGetConnection = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        resolve(connection);
    });
});
export const restoreMock = jest.fn().mockImplementation(() => {
    connection = null;
});

export const resetMock = jest.fn().mockReset();

const mockConnectionProvider = jest.fn().mockImplementation(() => {
    return {
        setConnection: mockSetConnection,
        getConnection : mockGetConnection,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockConnectionProvider;
