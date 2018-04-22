import { mockElement } from './mock';
import LoadingMock from './loading';

export const mockGetEl = mockElement('ion-loading-controller') as HTMLElement;

let loading: any = null;
let opts: any = null;

export const mockCreate = jest.fn().mockImplementation((options) => {
    return new Promise((resolve ) => {
        opts = options;
        loading = new LoadingMock();
        loading.el = mockElement('ion-loading') as HTMLElement;
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
        el: mockGetEl,
        create: mockCreate,
        getLoadingMock: getLoadingMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockLoadingController;
