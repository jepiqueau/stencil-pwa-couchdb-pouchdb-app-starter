import { mockElement } from '@stencil/core/testing';
import MenuMock from './menu';
import { getValueFromKey, indexofKeyInArray,
    isKeyInArray, getValuesFromArray } from './utilities';

export const mockGetEl = mockElement('ion-menu-controller') as HTMLElement;

let menus: Array<any> = [];
let menu : any = null;
let menuOpen:string = null;


function setAll(opt:any): Promise<void> {
    let tmp: Array<any> =  [];
    menus.forEach((menu) => {
        if(opt.enable) menu.value.disabled = true;
        if(opt.active) menu.value.active = false;
        tmp = [...tmp,menu];
    });
    menus = tmp.slice(0);
    return Promise.resolve();
}

export const mockOpen = jest.fn().mockImplementation((menuId?:string): Promise<boolean> => {
    return new Promise(async (resolve ) => {
        menu = await mockGet(menuId);
        if(!menu) {            
            menu = new MenuMock() as any;
            menu.el = mockElement('ion-menu') as HTMLElement;
            let mId:string = menuId ? menuId: null;
            if(mId != null ) {
                menu.menuId = menuId;
            } else {
                menu.menuId = 'left';
            }
            menu.el.setAttribute('menuID',menuId);
            menu.el.setAttribute('class','menu-type-overlay menu-enable menu-side-left menu menu-md');
            menu.disabled = false;
            menu.active = true;
            menu.setDataMock({open:true,toggle:true});
            setAll({enable:true,activate:true}).then( () => {
                menus =[...menus,{key:mId,value:menu}];
        
                if(menuOpen != null ) {
                    indexofKeyInArray(menus,menuOpen).then((index) => {
                        if(index >= 0 ) {
                            menus[index].value.active = false;                  
                            menus[index].value.close().then(() => {
                                menuOpen = menuId;
                                resolve(menu.open());  
                            }) 
                        } 
                    })
                } else {
                    menuOpen = menuId;
                    resolve(menu.open());
                }
            });
        } else {
            setAll({enable:true,activate:true}).then(() => {
                menu.disabled = false;
                resolve(menu.open());
            });
        }
    });
});
export const mockClose= jest.fn().mockImplementation(async (menuId?:string): Promise<boolean> => {
    menu = await mockGet(menuId);
    if(menu) {
        return Promise.resolve(menu.close());
    } else {
        return Promise.resolve(false);
    }
});
export const mockToggle= jest.fn().mockImplementation(async (menuId?:string): Promise<boolean> => {
    menu = await mockGet(menuId);
    if(menu) {
        setAll({activate:true})
        menu.activate = true;
        return Promise.resolve(menu.toggle());
    } else {
        return Promise.resolve(false);
    }
});
export const mockEnable= jest.fn().mockImplementation(async (shouldEnable: boolean,menuId?:string): Promise<boolean> => {
    let enableMenu = await mockGet(menuId);
    if(enableMenu) {
        enableMenu.disabled = !shouldEnable;
        return Promise.resolve(enableMenu);
    } else {
        return Promise.resolve(false);
    }
});
export const mockGet = jest.fn().mockImplementation(async (menuId?:string): Promise<any> => {
    const mId = menuId ? menuId : 'left';
    let res:boolean = await isKeyInArray (menus,mId);
    if(!res) return Promise.resolve(false);
    let value:any = await getValueFromKey(menus,mId);
    return Promise.resolve(value);
});
export const mockGetMenus = jest.fn().mockImplementation(async (): Promise<Array<any>> => {
    let values: Array<any> = await getValuesFromArray(menus);
    return Promise.resolve(values);
});    
export const getMenusMock = jest.fn().mockImplementation(() => {
    return menus;
});
export const isMenuActiveMock= jest.fn().mockImplementation(async (menuId?:string): Promise<boolean> => {
    menu = await mockGet(menuId);
    if(menu) {
        return Promise.resolve(menu.active);
    } else {
        return Promise.resolve(false);
    }
});export const restoreMock = jest.fn().mockImplementation(() => {
    menus = [];
    menu  = null;
    menuOpen = null;
});
export const resetMock = jest.fn().mockReset();

const mockMenuController = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        open: mockOpen,
        close: mockClose,
        toggle: mockToggle,
        enable: mockEnable,
        get: mockGet,
        getMenus: mockGetMenus,
        getMenusMock:  getMenusMock,
        isMenuActiveMock: isMenuActiveMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockMenuController;
