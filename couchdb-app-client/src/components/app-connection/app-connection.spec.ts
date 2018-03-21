import { AppConnection} from './app-connection';


describe('connectionprovider', () => {
    let connProv: any;
    beforeEach(() => {
        connProv = new AppConnection();        
    });
    afterEach(() => {
        connProv = null;        
    });
    it('should create an Connection Provider', () => {
        expect(connProv).toBeDefined;
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