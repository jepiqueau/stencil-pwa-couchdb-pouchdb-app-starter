import { mockElement } from './mock';
import { ComponentProps } from '@ionic/core';
import ViewCtrlMock from './viewcontroller';
import { indexofKeyInArray } from './utilities';

export const mockGetEl = mockElement('ion-nav') as HTMLElement;
let pages: Array<{key:string,value:{page:string,data:any}}> = [];
let views: Array<{key:string,value:any}> = [];
let page:string = null;
let data:ComponentProps = null;
let viewCtrlMock: any = null;
let dom:any;

export const mockPush = jest.fn().mockImplementation((cmp:string,params?:ComponentProps) => {
    return new Promise((resolve ) => {
        page = cmp;
        data = params ? params : null;
        pages =[...pages,{key:cmp,value:{page:page,data:data}}];
        let el: HTMLElement = dom.querySelector(cmp);
        el && data && Object.assign(el,data); 
        viewCtrlMock = new ViewCtrlMock() as any;
        viewCtrlMock.component = cmp;
        viewCtrlMock.data = params;
        views = [...views,{key:cmp,value:viewCtrlMock}];
        resolve(true);
    });
});
export const mockSetRoot = jest.fn().mockImplementation((cmp:string,params?:ComponentProps) => {
    return new Promise((resolve ) => {
        pages = [];
        views = [];
        page = cmp;
        data = params ? params : null;
        pages =[...pages,{key:cmp,value:{page:page,data:data}}]
        let el: HTMLElement = dom.querySelector(cmp);
        el && data && Object.assign(el,data); 
        viewCtrlMock = new ViewCtrlMock() as any;
        viewCtrlMock.component = cmp;
        viewCtrlMock.data = params;
        views = [...views,{key:cmp,value:viewCtrlMock}];
        resolve(true);
    });
});
export const mockPop = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        if(pages.length > 1) {
            pages.splice(-1,1);
            views.splice(-1,1);
            page = pages[pages.length-1].value.page;
            data = pages[pages.length-1].value.data;;             
        } else {
            page = pages[0].value.page;
            data = pages[0].value.data;;   
        }
        viewCtrlMock = new ViewCtrlMock() as any;;
        viewCtrlMock.component = page;
        viewCtrlMock.data = data;
        resolve(true);
    });
});
export const setDomMock= jest.fn().mockImplementation((idom:any) => {
    dom = idom;
});
export const mockGetActive = jest.fn().mockImplementation((): any => {
    return viewCtrlMock != null ? viewCtrlMock : null;
});
export const mockCanGoBack = jest.fn().mockImplementation((view = mockGetActive()): boolean => {
    return !!(view && mockGetPrevious(view));;
});

export const mockGetPrevious = jest.fn().mockImplementation((view = mockGetActive()): any => {
    if (!view) {
      return undefined;
    }
    let index: number = indexofKeyInArray(views,view.component);
        return (index > 0) ? views[index - 1] : undefined;
});
export const getPageMock = jest.fn().mockImplementation((): any => {
    return page;
});
export const getPagesMock = jest.fn().mockImplementation((): any => {
    return pages;
});
export const getViewsMock = jest.fn().mockImplementation((): any => {
    return views;
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
        canGoBack: mockCanGoBack,
        getPrevious: mockGetPrevious,
        getActive: mockGetActive,
        getViewsMock: getViewsMock,
        getPageMock: getPageMock,
        getDataMock: getDataMock,
        getPagesMock: getPagesMock,
        setDomMock: setDomMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockNav;
