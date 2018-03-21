import AppConnMock from './app-connection';


describe('connectionprovider', () => {
    let connProv: any;
    beforeEach(() => {
        connProv = new AppConnMock();        
    });
    afterEach(() => {
        connProv.restoreMock();
        connProv.resetMock();
    });
    it('should create an Connection Provider from mock', () => {
        expect(connProv).toBeDefined;
    });
    it('When connProv created show have el= app-connection', () => {
        expect(connProv.el.tagName).toEqual('APP-CONNECTION');
    });
    it('should set the connection to connected', async () => {
        connProv.setConnection('connected');
        expect(await connProv.getConnection()).toEqual('connected');
    });
    it('should get the connection as connected', async () => {
        connProv.setConnection('connected');
        expect(await connProv.getConnection()).toEqual('connected');
    });
    it('should set the connection to offline', async () => {
        connProv.setConnection('offline');
        expect(await connProv.getConnection()).toEqual('offline');
    });
    it('should get the connection as offline', async () => {
        connProv.setConnection('offline');
        expect(await connProv.getConnection()).toEqual('offline');
    });
});