import { mockElement } from '@stencil/core/testing';
import PopoverMock from './popover';
import { getValueFromKey, isKeyInArray, deleteKeyInArray } from './utilities';

export const mockGetEl = mockElement('ion-popover-controller') as HTMLElement;

let popover:any = null;
let popovers:Array<any> = [];
let popId:number = 1; 

export const mockCreate = jest.fn().mockImplementation((options?:any): Promise<any> => {
    return new Promise((resolve ) => {
        popover = new PopoverMock() as any;
        popover.el = mockElement('ion-popover') as HTMLElement;
        let opt: any = options ? options : null;
        let component: any = opt != null ? opt.component : null;
        let ev: any = opt != null ? opt.ev : null;
        let data: any = opt != null ? opt.data : null;
        if(component != null) popover.el.component = component;
        if(ev != null) popover.el.ev = ev;
        if(data != null) popover.el.data = data.data;
        popover.setDataMock({component:component,data:data,ev:ev});
        popovers =[...popovers,{key:popId++,value:popover}];
        resolve(popover);
    });
});
export const mockDismiss = jest.fn().mockImplementation((popoverId:number): Promise<any> => {
    return new Promise((resolve) => {
        getValueFromKey(popovers,popoverId).then((poverToDismiss) => {
            deleteKeyInArray(popovers,popoverId).then(() => {
                poverToDismiss.dismiss().then(() => {
                    resolve({});
                });       
            });
    
        });        
    });
});
export const getPopoverMock = jest.fn().mockImplementation(async (pId:number): Promise<any> => {
    let res:boolean = await isKeyInArray (popovers,pId);
    if(!res) return Promise.resolve(false);
    let value:any = await getValueFromKey(popovers,pId);
    return Promise.resolve(value);
});
export const getPopoversMock = jest.fn().mockImplementation((): Promise<any> => {
    return Promise.resolve(popovers);
});
export const restoreMock = jest.fn().mockImplementation(() => {
    popover = null;
    popovers = [];
    popId = 1; 
    });
export const resetMock = jest.fn().mockReset();

const mockPopoverController = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        create: mockCreate,
        dismiss: mockDismiss,
        getPopoverMock: getPopoverMock,
        getPopoversMock: getPopoversMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockPopoverController;
