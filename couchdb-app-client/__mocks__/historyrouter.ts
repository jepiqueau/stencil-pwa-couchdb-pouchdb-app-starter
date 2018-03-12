let path:any = null;
let state:any = null;
export const mockPush = jest.fn().mockImplementation((epath:any,estate:any) => {
    path = epath;
    state = estate;
});
export const getPathMock = jest.fn().mockImplementation(() => {
    return path;
});
export const getStateMock = jest.fn().mockImplementation(() => {
    return state;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    path = null;
    state = null;
});
export const resetMock = jest.fn().mockReset();

const mockHistoryRouter = jest.fn().mockImplementation(() => {
    return {
        push: mockPush,
        getPathMock : getPathMock,
        getStateMock : getStateMock,
        restoreMock : restoreMock,
        resetMock: resetMock
    };
});

export default mockHistoryRouter;
