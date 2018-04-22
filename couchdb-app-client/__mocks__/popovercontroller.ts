import { mockElement } from './mock';
import PopoverMock from './popover';
import { getValueFromKey, isKeyInArray, deleteKeyInArray, getHighestKey } from './utilities';

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
        let componentProps: any = opt != null ? opt.componentProps : null;
        popover.component = component != null ? component : null;
        popover.ev = ev != null ? ev : null;
        popover.componentProps = componentProps != null ? componentProps : null;
        popovers =[...popovers,{key:popId++,value:popover}];
        resolve(popover);
    });
});
export const mockDismiss = jest.fn().mockImplementation((popoverId:number = -1): Promise<any> => {
    return new Promise((resolve) => {
        popoverId = popoverId >= 0 ? popoverId : getHighestKey(popovers);
        let poverToDismiss: any = getValueFromKey(popovers,popoverId);
        deleteKeyInArray(popovers,popoverId);
        poverToDismiss.dismiss().then(() => {
            resolve({});
        });           
    });
});
export const mockGetTop = jest.fn().mockImplementation((): any => {
    return popover;
});
export const getPopoverMock = jest.fn().mockImplementation((pId:number): Promise<any> => {
    let res:boolean = isKeyInArray (popovers,pId);
    if(!res) return Promise.resolve(false);
    let value:any = getValueFromKey(popovers,pId);
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
        getTop: mockGetTop,
        getPopoverMock: getPopoverMock,
        getPopoversMock: getPopoversMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockPopoverController;
