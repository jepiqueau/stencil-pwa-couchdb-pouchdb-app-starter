import AppSessionMock from './app-session';

describe('app-sessionMock', () => {
    let appSession: any;
    let session: any;
    beforeEach(async () => {
        appSession = new AppSessionMock();
        session = {
            user_id: 'joesmith',
            token: 'gtKeORg_Slukgc4I5drTpQ',
            password: 'ckD64AN4QGWCVUgvZjlmCA',
            roles: ['user'],
            issued: Date.now() - 10000,
            expires: Date.now() + 1500000,
            provider: "local",
            ip: "::1",
            userDBs: {
                jpqtest: "http://gtKeORg_Slukgc4I5drTpQ:ckD64AN4QGWCVUgvZjlmCA@localhost:5984/jpqtest"
            }            
        };
    });
    afterEach(async () => {
        appSession.restoreMock();
        appSession.resetMock();
        appSession = null;
    });
    it('should build', () => {
        expect(appSession).toBeTruthy();
    });
    it('should save session data to store', async () => {
        appSession.saveSessionData(session);
        let result = await appSession.getSessionData();
        expect(result).toEqual(session);
    });
    it('should return session data from store', async () => {
        appSession.saveSessionData(session);
        let result = await appSession.getSessionData();
        expect(result).toEqual(session);
    });
    it('should get current session data from store', async () => {
        appSession.saveSessionData(session);
        let result = await appSession.getCurrentSession();
        expect(result).toEqual(session);
    });
    it('should remove current session data from store', async () => {
        appSession.saveSessionData(session);
        await appSession.removeSessionData();
        let result = await appSession.getCurrentSession();
        expect(result).toBeNull();
    });
    
});
