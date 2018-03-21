import { NavParams } from '@ionic/core/dist/types/components/nav/nav-util';
let view :any = null;
let navParams:NavParams = null;
export const constructorMock = jest.fn().mockImplementation((component:string,data?:any) => {
    view = component;
    navParams= data;
});
export const getParamsMock = jest.fn().mockImplementation((): Promise<any> => {
    return new Promise((resolve ) => {
        resolve(navParams);
    });
});
export const getViewMock = jest.fn().mockImplementation((): Promise<any> => {
    return new Promise((resolve ) => {
        resolve(view);
    });
});
export const restoreMock = jest.fn().mockImplementation(() => {
    navParams = null;
    view = null;
});
export const resetMock = jest.fn().mockReset();

const mockViewController = jest.fn().mockImplementation(() => {
    return {
        constructorMock : constructorMock,
        getParamsMock: getParamsMock,
        getViewMock: getViewMock,
        restoreMock : restoreMock,
        resetMock: resetMock
    };
});

export default mockViewController;
