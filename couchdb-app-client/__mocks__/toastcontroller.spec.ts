import toastCtrlMock from './toastcontroller';


describe('toastcontroller', () => {
    let toastCtrl: any;
    beforeEach(() => {
        toastCtrl = new toastCtrlMock();        
    });
    afterEach(() => {
        toastCtrl.restoreMock();
        toastCtrl.resetMock();
        toastCtrl = null;        
    });
    it('should create a ToastController from mock', () => {
        expect(toastCtrl).toBeDefined;
    });
    it('When ToastController created show have el= ion-toast-controller', () => {
        expect(toastCtrl.el.tagName).toEqual('ION-TOAST-CONTROLLER');
    });
    it('should create a toast from the Toast Controller', async () => {
        let toast:any = await toastCtrl.create('my message from mock',1500);
        expect(toast).toBeDefined;
        let message:string = await toast.present();
        expect(message).toEqual('my message from mock');        
    });
    it('should present a toast created from the Toast Controller', async () => {
        let toast:any = await toastCtrl.create('my message from mock',1500);
        expect(toast).toBeDefined;
        let message:string = await toast.present();
        expect(message).toEqual('my message from mock');        
    });
    it('should return a toast from the Toast Controller after create', async () => {
        let toast:any = await toastCtrl.create('my message from mock',1500);
        let resToast = toastCtrl.getToastMock();
        let message:string = await resToast.getContentMock();
        expect(message).toEqual('my message from mock');        
    });
});
