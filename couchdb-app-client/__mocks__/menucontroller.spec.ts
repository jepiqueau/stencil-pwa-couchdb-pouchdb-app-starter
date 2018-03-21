import MenuCtrlMock from './menucontroller';
import MenuMock from './menu';

describe('menucontroller', () => {
    let menuCtrl: any;
    beforeEach(async () => {
        menuCtrl = new MenuCtrlMock();        
    });
    afterEach(async () => {
        menuCtrl.restoreMock();
        menuCtrl.resetMock();
    });
    it('should create a MenuController from mock',async () => {
        expect(menuCtrl).toBeDefined();
    });
    it('When LoadingController created show have el= ion-menu-controller', () => {
        expect(menuCtrl.el.tagName).toEqual('ION-MENU-CONTROLLER');
    });
    it('should open the menu from the MenuController', async () => {
        let res:boolean = await menuCtrl.open('menu');
        expect(res).toBeTruthy();
    });
    it('should get the menu from the MenuController', done => {
        menuCtrl.open('menu').then(()=> {
            menuCtrl.get('menu').then((menu)=> {
                expect(menu).toBeTruthy();
                expect(menu.el.getAttribute('menuId')).toEqual('menu');
                done();
            });
        });
    });
    it('should close the menu from the MenuController', done => {
        menuCtrl.open('menu').then(()=> {
            menuCtrl.close('menu').then((res)=> {
                expect(res).toBeFalsy();
                done();
            });
        });
    });
    it('should return IsOpen true when a menu is opened from the MenuController', done => {
        menuCtrl.open('menu').then(()=> {
            menuCtrl.get('menu').then((menu)=> {
                expect(menu.isOpen()).toBeTruthy();
                done();
            });
        });
    });
    it('should return IsOpen false when a menu is closed from the MenuController', done => {
        menuCtrl.open('menu').then(()=> {
            menuCtrl.close('menu').then(()=> {
                menuCtrl.get('menu').then((menu)=> {
                    expect(menu.isOpen()).toBeFalsy();
                    done();
                });
            });
        });
    });
    it('should toggle a menu from the MenuController', done => {
        menuCtrl.open('menu').then(()=> {
            menuCtrl.toggle('menu').then((res)=> {
                expect(res).toBeFalsy();
                done();
            });
        });
    });
    it('should toggle a toggled menu from the MenuController', done => {
        menuCtrl.open('menu').then(()=> {
            menuCtrl.toggle('menu').then((res)=> {
                expect(res).toBeFalsy();
                menuCtrl.toggle('menu').then((result)=> {
                    expect(result).toBeTruthy();
                    done();
                });
            });           
        });
    });
    it('should open a second menu from the MenuController', done => {
        menuCtrl.open('menu1').then((res)=> {
            expect(res).toBeTruthy();
            menuCtrl.open('menu2').then((res1)=> {
                expect(res1).toBeTruthy();
                done();
            });
        });        
    });

    it('should get the Menus from the MenuController', done => {
        menuCtrl.open('menu1').then((res)=> {
            expect(res).toBeTruthy();
            menuCtrl.open('menu2').then((res1) => {
                expect(res1).toBeTruthy(); 
                menuCtrl.getMenus().then((menus) => {
                    expect(menus.length).toEqual(2);
                    done();
                });
            });
        });
    });
    it('should have the second Menu Open and the first one Close', done => {
        menuCtrl.open('menu1').then((res)=> {
            expect(res).toBeTruthy();
            menuCtrl.get('menu1').then((menu1)=> {
                expect(menu1.isOpen()).toBeTruthy();
                menuCtrl.open('menu2').then((res1) => {
                    expect(res1).toBeTruthy();
                    menuCtrl.isMenuActiveMock('menu1').then((isMenu1)=> {        
                    expect(isMenu1).toBeFalsy();
                        menuCtrl.get('menu2').then((menu2)=> {
                            menuCtrl.isMenuActiveMock('menu2').then((isMenu2)=> {        
                                expect(menu2.isOpen()).toBeTruthy();
                                expect(isMenu2).toBeTruthy();
                            done();
                            });
                        });
                    });
                });
            });
        });
    });
    it('should have the second Menu enable and the first one disable', done => {
        menuCtrl.open('menu1').then((res)=> {
            expect(res).toBeTruthy();
            menuCtrl.open('menu2').then((res1) => {
                expect(res1).toBeTruthy();        
                menuCtrl.getMenus().then((menus) => {
                    expect(menus[0].disabled).toBeTruthy();   
                    expect(menus[1].disabled).toBeFalsy();
                    done();   
                });
            });
        });
    });
    it('should have the second Menu close and the first one open when toggling the first one', done => {
        menuCtrl.open('menu1').then((res)=> {
            expect(res).toBeTruthy();
            menuCtrl.open('menu2').then((res1) => {
                expect(res1).toBeTruthy();

                menuCtrl.toggle('menu1').then(() => {
                    menuCtrl.getMenus().then(async (menus) => {                        
                        expect(menus[0].activate).toBeTruthy();
                        expect(menus[1].activate).toBeFalsy();   
                        done();   
                    });
                });
            });
        });
    });
});
