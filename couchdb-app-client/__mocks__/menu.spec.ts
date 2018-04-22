import { mockWindow, mockDocument } from './mock';
import MenuMock from './menu';


describe('menu', () => {
    let menu: any;
    let window: any;
    let dom: Document;
    beforeEach(async () => {
        menu = new MenuMock();        
        window = mockWindow();
        dom = mockDocument();;
        await dom.body.appendChild(menu.el);    
      });
    afterEach(() => {
        menu.restoreMock();
        menu.resetMock();
        window = null;
        dom = null;
    });
    it('should create a Menu from mock', () => {
        expect(menu).toBeDefined;
    });
    it('should return no Menu Open', async () => {
        expect(menu.isOpen()).toBeFalsy();
    });
    it('should open a Menu', async () => {
        let res:boolean = await menu.open();
        expect(res).toBeTruthy();
    });
    it('should return Menu Open after opening a menu', async () => {
        await menu.open();
        expect(menu.isOpen()).toBeTruthy();
    });
    it('should add "show-menu" class after opening a menu', async () => {
        await menu.open();
        expect(menu.el.classList.contains('show-menu')).toBeTruthy();
    });
    it('should close a Menu', done => {
        menu.open().then(() => {
            menu.close().then(res => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });
    it('should return no Menu Open after closing the menu', done => {
        menu.open().then(() => {
            menu.close().then(res => {
                expect(res).toBeFalsy();
                expect(menu.isOpen()).toBeFalsy();
                done();
            });
        });
    });
    it('should remove "show-menu" class after closinging a menu', done => {
        menu.open().then(() => {
            menu.close().then(res => {
                expect(menu.el.classList.contains('show-menu')).toBeFalsy();
                done();
            });
        });
    });
    it('should toggle a Menu', done => {
        menu.open().then(() => {
            menu.toggle().then(res => {
                expect(res).toBeFalsy();
                done();
            });
        });
    });
    it('should toggle a toggled Menu', done => {
        menu.open().then(() => {
            menu.toggle().then(() => {
                 menu.toggle().then(res => {
                    expect(res).toBeTruthy();
                    done();
                });
            });
        });
    });
    it('should close a Menu when toggle an open Menu', done => {
        menu.open().then(() => {
            menu.toggle().then(() => {
                expect(menu.isOpen()).toBeFalsy();
                expect(menu.el.classList.contains('show-menu')).toBeFalsy();
                done();
            });
        })
    });
    it('should open a Menu when toggle an close Menu', done => {
        menu.open().then(() => {
            menu.close().then(() => {
                menu.toggle().then((res) => {
                    expect(menu.isOpen()).toBeTruthy();
                    expect(menu.el.classList.contains('show-menu')).toBeTruthy();
                    done();
                    }) ;
            }); 
        });
    });
    
});
