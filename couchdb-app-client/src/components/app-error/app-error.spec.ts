import { flush, render } from '@stencil/core/testing';
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
        let element: any;
        beforeEach(async () => {
            element = await render({
                components: [AppError],
                html: '<app-error></app-error>'
            });
        });
        it('should render', async () => {
            await flush(element);
            expect(element).not.toBeNull();
        });
            
    });
});