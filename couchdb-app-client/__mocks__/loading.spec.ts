import LoadingMock from './loading';


describe('loading', () => {
    let loading: any;
    beforeEach(() => {
        loading = new LoadingMock();        
    });
    afterEach(() => {
        loading.restoreMock();
        loading.resetMock();
        loading = null;        
    });
    it('should create a Loading from mock', () => {
        expect(loading).toBeDefined;
    });
    it('should set the loading content', () => {
        loading.setContentMock('Authenticating ...');
        expect(loading.getContentMock()).toEqual('Authenticating ...');
    });
    it('should get the loading content', () => {
        loading.setContentMock('Authenticating ...');
        expect(loading.getContentMock()).toEqual('Authenticating ...');
    });
    it('should present the loading', async () => {
        loading.setContentMock('Authenticating ...');
        expect(await loading.present()).toEqual('Authenticating ...');
    });
    it('should dismiss the loading', async () => {
        loading.setContentMock('Authenticating ...');
        await loading.dismiss();
        expect(loading.getContentMock()).toBeNull();
    });
    
});