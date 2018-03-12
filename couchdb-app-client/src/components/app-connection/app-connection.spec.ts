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
    it('should set the connection to connected', () => {
        connProv.setConnection('connected');
        expect(connProv.getConnection()).toEqual('connected');
    });
    it('should get the connection as connected', () => {
        connProv.setConnection('connected');
        expect(connProv.getConnection()).toEqual('connected');
    });
    it('should set the connection to offline', () => {
        connProv.setConnection('offline');
        expect(connProv.getConnection()).toEqual('offline');
    });
    it('should get the connection as offline', () => {
        connProv.setConnection('offline');
        expect(connProv.getConnection()).toEqual('offline');
    });
});