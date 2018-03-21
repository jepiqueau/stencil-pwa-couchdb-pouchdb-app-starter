import AppAuthMock from './app-auth';

describe('app-authMock', () => {
    let appAuth: any;
    let session: any;
    beforeEach(async () => {
        appAuth = new AppAuthMock();
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
        appAuth.restoreMock();
        appAuth.resetMock();
        appAuth = null;
    });
    it('should build', () => {
        expect(appAuth).toBeTruthy();
    });
    it('When appAuth created show have el= app-auth', () => {
        expect(appAuth.el.tagName).toEqual('APP-AUTH');
    });
    it('should not have server connected', async () => {
        let isServer:boolean = await appAuth.getIsServer();
        expect(isServer).toBeFalsy();       
    });
    it('should have server connected', async () => {
        appAuth.responseMock({status:200,result:{server:true,dbserver:true}});
        let result:any = await appAuth.isServersConnected();
        expect(result).toEqual({status:200,result:{server:true,dbserver:true}});
        let isServer:boolean = await appAuth.getIsServer();
        expect(isServer).toBeTruthy();       
    });
    it('should return Application Server not connected', async () => {
        appAuth.responseMock({status:400,message:"Application Server not connected"});
        let result:any = await appAuth.isServersConnected();
        expect(result).toEqual({status:400,message:"Application Server not connected"});
        let isServer:boolean = await appAuth.getIsServer();
        expect(isServer).toBeFalsy();       
    });
    it('Should return status 200 when reauthenticate and pouchDB database exists', async () => {
        let server: any = {status:200,result:{server:true,dbserver:true}};
        appAuth.responseMock(server);
        appAuth.dataReauthenticateMock({status:200});
        let options:any = {db:true};
        let result:any = await appAuth.reauthenticate(server,options);
        expect(result).toEqual({status:200});
    });
    it('Should return status 200 when reauthenticate and valid session', async () => {
        let server: any = {status:200,result:{server:true,dbserver:true}};
        appAuth.responseMock({status:200});
        appAuth.dataReauthenticateMock({status:200});
        let result:any = await appAuth.reauthenticate(server);
        expect(result).toEqual({status:200});
    });
    it('Should return status 200 when reauthenticate, valid session and server deconnected', async () => {
        let server: any = {status:400,message:"Application Server not connected"};
        appAuth.responseMock(server);
        appAuth.dataReauthenticateMock({status:200});
        let result:any = await appAuth.reauthenticate(server);
        expect(result).toEqual({status:200});
    });
    it('Should return status 400 when reauthenticate and no session opened', async () => {
        let server: any = {status:200,result:{server:true,dbserver:true}};
        appAuth.dataReauthenticateMock({status:400, message:'No session opened'});
        appAuth.responseMock({status:400 , message:'No session opened'});
        let result:any = await appAuth.reauthenticate(server);
        expect(result).toEqual({status:400 , message:'No session opened'});
    });
    it('Should return status 400 when reauthenticate and session expired', async () => {
        let server: any = {status:200,result:{server:true,dbserver:true}};
        appAuth.dataReauthenticateMock({status:400, message:'Session expired'});
        appAuth.responseMock({status:400 , message:'Session expired'});
        let result:any = await appAuth.reauthenticate(server);
        expect(result).toEqual({status:400 , message:'Session expired'});
    });
    it('Should return status 400 when logout and no session opened', async () => {
        appAuth.responseMock({status:400 , message:'No session opened'});
        let result:any = await appAuth.logout();
        expect(result).toEqual({status:400 , message:'No session opened'});
    });   
    it('Should return status 401 when logout and and alredy logged out', async () => {
        appAuth.responseMock({status:401 , message:'Unauthorized: Not logged', session: true});
        let result:any = await appAuth.logout();
        expect(result).toEqual({status:401 , message:'Unauthorized: Not logged'});
    });   
    it('Should return status 200 when logout', async () => {
        appAuth.responseMock({status:200 , success:'Logged out', session: true});
        let result:any = await appAuth.logout();
        expect(result).toEqual({status:200 , success:'Logged out'});
    });   
    it('Should return status 200 when register is succesful', async () => {
        appAuth.responseMock({status:200 , result:session});
        let result:any = await appAuth.register();
        expect(result).toEqual({status:200 , result:session});
    });   
    it('Should return status 400 when register is not succesful', async () => {
        appAuth.responseMock({status:400 , message:'Bad Request'});
        let result:any = await appAuth.register();
        expect(result).toEqual({status:400 , message:'Bad Request'});
    });   
    it('Should return status 200 when username is not existing in CouchDB', async () => {
        appAuth.responseMock({status:200});
        let result:any = await appAuth.validateUsername();
        expect(result).toEqual({status:200});
    });   
    it('Should return status 409 when username is already existing in CouchDB', async () => {
        appAuth.responseMock({status:409 , message:'Bad Request'});
        let result:any = await appAuth.validateUsername();
        expect(result).toEqual({status:409 , message:'Bad Request'});
    });   
    it('Should return status 200 when email is not existing in CouchDB', async () => {
        appAuth.responseMock({status:200});
        let result:any = await appAuth.validateEmail();
        expect(result).toEqual({status:200});
    });   
    it('Should return status 409 when emeil is already existing in CouchDB', async () => {
        appAuth.responseMock({status:409 , message:'Bad Request'});
        let result:any = await appAuth.validateEmail();
        expect(result).toEqual({status:409 , message:'Bad Request'});
    });   
    it('Should return status 200 when authenticate is succesful', async () => {
        appAuth.responseMock({status:200 , result:session});
        let result:any = await appAuth.authenticate();
        expect(result).toEqual({status:200 , result:session});
    });   
    it('Should return status 401 when authenticate and Invalid Username or Password', async () => {
        appAuth.responseMock({status:401 , message:'Unauthorized: Invalid Username or Password'});
        let result:any = await appAuth.authenticate();
        expect(result).toEqual({status:401 , message:'Unauthorized: Invalid Username or Password'});
    });   
    it('Should return status 400 when authenticate and CouchDB server not connected', async () => {
        appAuth.responseMock({status:400 , message:'Bad Request'});
        let result:any = await appAuth.authenticate();
        expect(result).toEqual({status:400 , message:'Bad Request'});
    });   
        
});