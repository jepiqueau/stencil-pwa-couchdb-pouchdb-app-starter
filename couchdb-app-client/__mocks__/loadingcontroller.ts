import LoadingMock from './loading';
let loading: any = null;
let opts: any = null;
export const mockCreate = jest.fn().mockImplementation((opts) => {
    return new Promise((resolve ) => {
        loading = new LoadingMock();
        loading.setContentMock(opts.content);
        resolve(loading);
    });
});
export const getLoadingMock = jest.fn().mockImplementation(() => {
    return loading;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    loading = null;
    opts = null;
});
export const resetMock = jest.fn().mockReset();

const mockLoadingController = jest.fn().mockImplementation(() => {
    return {
        create: mockCreate,
        getLoadingMock: getLoadingMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockLoadingController;
