import viewCtrlMock from './viewcontroller';


describe('viewcontroller', () => {
    let viewCtrl: any;
    beforeEach(() => {
        viewCtrl = new viewCtrlMock();        
    });
    afterEach(() => {
        viewCtrl.restoreMock();
        viewCtrl.resetMock();
        viewCtrl = null;        
    });
    it('should create a ViewController from mock',async () => {
        expect(viewCtrl).toBeDefined();
        await viewCtrl.constructorMock('app-profile',{name:'stencil'});
    });

    it('should get the navParams from the ViewController', async (done) => {
        await viewCtrl.constructorMock('app-profile',{name:'stencil'});
        viewCtrl.getParamsMock().then((navParams) => {
            expect(navParams['name']).toEqual('stencil');
            done();
        });    
    });
    it('should get the view from the ViewController', async (done) => {
        await viewCtrl.constructorMock('app-profile',{name:'stencil'});
        viewCtrl.getViewMock().then((view) => {
            expect(view).toEqual('app-profile');
            done();
        });    
    });
    it('should restore the ViewController', async (done) => {
        await viewCtrl.constructorMock('app-profile',{name:'stencil'});
        viewCtrl.restoreMock();
        viewCtrl.getParamsMock().then((navParams) => {
            expect(navParams).toBeNull();
            done();
        }); 
    });
});
