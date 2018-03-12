import loadingCtrlMock from './loadingcontroller';


describe('loadingcontroller', () => {
    let loadingCtrl: any;
    beforeEach(() => {
        loadingCtrl = new loadingCtrlMock();        
    });
    afterEach(() => {
        loadingCtrl.restoreMock();
        loadingCtrl.resetMock();
        loadingCtrl = null;        
    });
    it('should create a LoadingController from mock', () => {
        expect(loadingCtrl).toBeDefined;
    });
    it('should create a loading from the Loading Controller', async () => {
        let loading:any = await loadingCtrl.create({
            content: 'Authenticating...'
        });
        expect(loading).toBeDefined;
    });
    it('should present a loading created from the Loading Controller', async () => {
        let loading:any = await loadingCtrl.create({
            content: 'Authenticating...'
        });
        let message:string = await loading.present();
        expect(message).toEqual('Authenticating...');        
    });
    it('should return a loading from the Loading Controller after create', async () => {
        let loading:any = await loadingCtrl.create({
            content: 'Authenticating...'
        });
        let resLoading = loadingCtrl.getLoadingMock();
        let message:string = await resLoading.getContentMock();
        expect(message).toEqual('Authenticating...');        
    });
});
