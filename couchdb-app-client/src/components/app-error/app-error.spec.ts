import { TestWindow } from '@stencil/core/testing';
import { AppError} from './app-error';
import ToastCtrlMock from '../../../__mocks__/toastcontroller';

describe('app-error', () => {
    describe('app-error instance', async () => {
        let instance: any;
        let toastCtrl: any;
        beforeEach(async () => {
            instance = new AppError();
            toastCtrl = new ToastCtrlMock();
            instance.initController(toastCtrl);
        });
        afterEach(async () => {
            toastCtrl.restoreMock();
            toastCtrl.resetMock();
            toastCtrl = null;
            instance = null;
        });     
        it('should build', () => {
            expect(instance).toBeTruthy();
        });
        it('should display the error message', async () => {
            let message = 'Application Server not connected';
            await instance.showError(message);
            let toast: any =  toastCtrl.getToastMock();
            let result:any = await toast.present();
            expect(result.message).toEqual(message);
        });
    });

    describe('app-error rendering', () => {
        let window: TestWindow;
        let element;
        beforeEach(async () => {
            window = new TestWindow();
            element = await window.load({
                      components: [AppError],
                html: '<app-error></app-error>'
            });
        });
        afterEach(async () => {
            window = null;
        });
        it('should render', async () => {
            await window.flush();
            expect(element).not.toBeNull();
        });
            
    });
});