import ToastMock from './toast';


describe('toast', () => {
    let toast: any;
    beforeEach(() => {
        toast = new ToastMock();        
    });
    afterEach(() => {
        toast.restoreMock();
        toast.resetMock();
        toast = null;        
    });
    it('should create a Toast from mock', () => {
        expect(toast).toBeDefined;
    });
    it('should set the toast content', () => {
        toast.setContent('Test Toast');
        expect(toast.getContentMock()).toEqual('Test Toast');
    });
    it('should get the toast content', () => {
        toast.setContent('Test Toast');
        expect(toast.getContentMock()).toEqual('Test Toast');
    });
    it('should present the toast', async () => {
        toast.setContent('Test Toast')
        expect(await toast.present()).toEqual('Test Toast');
    });
    
});