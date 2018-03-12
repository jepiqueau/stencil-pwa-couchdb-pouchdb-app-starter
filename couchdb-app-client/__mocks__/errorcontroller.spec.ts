import ErrorCtrlMock from './errorcontroller';


describe('errorcontroller', () => {
    let errCtrl: any;
    beforeEach(() => {
        errCtrl = new ErrorCtrlMock();        
    });
    afterEach(() => {
        errCtrl.restoreMock();
        errCtrl.resetMock();
        errCtrl = null;        
    });
    it('should create an Error Controller from mock', () => {
        expect(errCtrl).toBeDefined;
    });
    it('should show an error message', () => {
        errCtrl.showError('Application Server not connected');
        expect(errCtrl.getMessageMock()).toEqual('Application Server not connected');
    });
    it('should return an error message', () => {
        errCtrl.showError('Application Server not connected');
        expect(errCtrl.getMessageMock()).toEqual('Application Server not connected');
    });
    it('should set an error message', () => {
        errCtrl.responseMock('Application Server not connected');
        expect(errCtrl.getMessageMock()).toEqual('Application Server not connected');
    });    
});