import { mockElement } from '@stencil/core/testing';
export const mockGetEl = mockElement('ion-menu') as HTMLElement;

let toggle:boolean = null;
let open:boolean = null;
export const mockOpen = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        mockGetEl.classList.add('show-menu');
        setDataMock({open:true,toggle:true});
        resolve(open);
    });
});
export const mockClose= jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        mockGetEl.classList.remove('show-menu');
        setDataMock({open:false,toggle:false});
        resolve(open);
    });
});
export const mockToggle= jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        if(mockGetEl.classList.contains('show-menu')) {
            mockGetEl.classList.remove('show-menu');            
        } else {
            mockGetEl.classList.add('show-menu');            
        }
        open = ! open;
        toggle = !toggle;
        resolve(toggle);
    });
});
export const mockIsOpen = jest.fn().mockImplementation(() => {
    return open;
});
export const getDataMock = jest.fn().mockImplementation(():any => {
    return {open:open,toggle:toggle};
});
export const setDataMock = jest.fn().mockImplementation((options?:any) => {
    let opt:any = options ? options : null;
    open = opt != null ? opt.open : null;
    toggle = opt != null ? opt.toggle : null;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    toggle = null;
    open = null;
    this.el = null;
    this.menuId = null;
    this.contentId = null;
});
export const resetMock = jest.fn().mockReset();

const mockMenu = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        isOpen: mockIsOpen,
        open : mockOpen,
        close : mockClose,
        toggle : mockToggle,
        getDataMock:getDataMock,
        setDataMock:setDataMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockMenu;
