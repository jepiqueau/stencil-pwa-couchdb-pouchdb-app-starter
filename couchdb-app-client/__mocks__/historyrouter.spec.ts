import historyRouterMock from './historyrouter';


describe('historyrouter', () => {
    let history: any;
    beforeEach(() => {
        history = new historyRouterMock();        
    });
    afterEach(() => {
        history.restoreMock();
        history.resetMock();
    });
    it('should create an HistoryRouter from mock', () => {
        expect(history).toBeDefined;
    });
    it('should push to a path from mock', () => {
        history.push('/home',{});
        expect(history.getPathMock()).toEqual('/home');
        expect(history.getStateMock()).toEqual({});
    });
    
});