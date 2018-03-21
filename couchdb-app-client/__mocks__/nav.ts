import { mockElement } from '@stencil/core/testing';
import { NavParams } from '@ionic/core/dist/types/components/nav/nav-util';
import ViewCtrlMock from './viewcontroller';

export const mockGetEl = mockElement('ion-nav') as HTMLElement;
let pages: Array<{key:string,value:{page:string,data:any}}> = [];
let page:string = null;
let data:NavParams = null;
let viewCtrlMock: any = null;

export const mockPush = jest.fn().mockImplementation((cmp:string,params?:NavParams) => {
    return new Promise((resolve ) => {
        page = cmp;
        data = params ? params : null;
        pages =[...pages,{key:cmp,value:{page:page,data:data}}]
        viewCtrlMock = new ViewCtrlMock() as any;
        viewCtrlMock.component = cmp;
        viewCtrlMock.data = params;
        resolve({});
    });
});
export const mockSetRoot = jest.fn().mockImplementation((cmp:string,params?:NavParams) => {
    return new Promise((resolve ) => {
        pages = [];
        page = cmp;
        data = params ? params : null;
        pages =[...pages,{key:cmp,value:{page:page,data:data}}]
        viewCtrlMock = new ViewCtrlMock() as any;
        viewCtrlMock.component = cmp;
        viewCtrlMock.data = params;
        resolve({});
    });
});
export const mockPop = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        if(pages.length > 1) {
            pages.splice(-1,1)
            page = pages[pages.length-1].value.page;
            data = pages[pages.length-1].value.data;;             
        } else {
            page = pages[0].value.page;
            data = pages[0].value.data;;   
        }
        viewCtrlMock = new ViewCtrlMock() as any;;
        viewCtrlMock.component = page;
        viewCtrlMock.data = data;
        resolve({});
    });
});export const mockGetActive = jest.fn().mockImplementation((): any => {
    return viewCtrlMock != null ? viewCtrlMock: null;
});
export const getPageMock = jest.fn().mockImplementation((): any => {
    return page;
});
export const getPagesMock = jest.fn().mockImplementation((): any => {
    return pages;
});

export const getDataMock = jest.fn().mockImplementation((): any => {
    return data;
});

export const restoreMock = jest.fn().mockImplementation(() => {
    page = null;
    data = null;
    viewCtrlMock = null;
    this.el = null;
    this.root = null;
    this.ionNavChanged = null;
});

export const resetMock = jest.fn().mockReset();

const mockNav = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        setRoot: mockSetRoot,
        push: mockPush,
        pop: mockPop,
        getActive: mockGetActive,
        getPageMock: getPageMock,
        getDataMock: getDataMock,
        getPagesMock: getPagesMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockNav;
