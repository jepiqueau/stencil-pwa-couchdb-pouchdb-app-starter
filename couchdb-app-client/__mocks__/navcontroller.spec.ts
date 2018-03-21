import NavCtrlMock from './navcontroller';
import NavMock from './nav';

describe('navcontroller', () => {
    let navCtrl: any;
    beforeEach(() => {
        navCtrl = new NavCtrlMock();        
    });
    afterEach(() => {
        navCtrl.restoreMock();
        navCtrl.resetMock();
        navCtrl = null;        
    });
    it('should create a NavController from mock',async () => {
        expect(navCtrl).toBeDefined();
    });

    it('should get the nav from the NavController', async () => {
        let nav:any = navCtrl.getNav();
        expect(nav).toBeDefined();
        expect(nav.el).not.toBeNull();
    });

});
