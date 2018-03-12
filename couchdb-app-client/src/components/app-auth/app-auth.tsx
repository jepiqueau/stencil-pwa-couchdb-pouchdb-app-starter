import { Component, Method, Element } from '@stencil/core';
import { Credentials, User, PDBOptions, Session } from '../../global/interfaces'
import { SERVER_ADDRESS,COUCHDB_NAME, FETCH_TIMEOUT, POUCHDB_NAME } from '../../global/constants';
import { initializeComponents, initializeMocks } from '../../helpers/ui-utilities';

@Component({
  tag: 'app-auth',
  styleUrl: 'app-auth.scss'
})
export class AppAuth {
    private _isServer: boolean = false;
    private _comps: any;

    @Element() el: HTMLElement;

    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._comps = {sessionProvider:true,pouchDBProvider:true};
        return initializeMocks(this._comps,mocks);
    }
    
    @Method()
    getIsServer (): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
          resolve(this._isServer);
      });
    }
    @Method()
    reauthenticate(server: any,options?:PDBOptions): Promise<any> {
        let opt = options ? options : null;
        return this._reauthenticate(server,opt).then(result => {
            return result;
        });
    }
    @Method()
    authenticate(user:Credentials,options?:PDBOptions): Promise<any> {
        let opt = options ? options : null;
        return this._authenticate(user,opt).then(result => {
            return result;
        });
    }
    @Method()
    validateUsername(username:string): Promise<any> {
        return this._validateUsername(username).then(result => {
            return result;
        });
    }
    @Method()
    validateEmail(email:string): Promise<any> {
        return this._validateEmail(email).then(result => {
            return result;
        });
    }
    @Method()
    register(user:User,options?:PDBOptions): Promise<any> {
        let opt = options ? options : null;
        return this._register(user,opt).then(result => {
            return result;
        });
    }
    @Method()
    logout(): Promise<any> {
        return this._logout().then(result => {
            return result;
        });
    }
    @Method()
    isServersConnected(): Promise<any> {
        return this._isServersConnected().then(result => {
            return result;
        });
    }
    async componentWillLoad() {
        this._comps = {sessionProvider:true,pouchDBProvider:true};
        await initializeComponents(this._comps);
    }
    // private methods

    // Check Servers (Application, CouchDB) connection
    _isServersConnected(): Promise<any> {
        return new Promise<any>( (resolve) => {
            let didTimeout:boolean = false;
            let servers: Promise<any> = new Promise<any> ((resolve,reject) => {
                const timeout = setTimeout(function() {
                    didTimeout = true;
                    reject({status:400,message:"Application Server not connected"});
                }, FETCH_TIMEOUT);
                let url:string = SERVER_ADDRESS + 'server';
                let requestHeaders: any = { 'Content-Type': 'application/json' };
                fetch(url, {
                    method: 'GET',
                    headers: requestHeaders,
                }).then((res) => {
                    return res.json();
                }).then((data) => {
                    clearTimeout(timeout);
                    if(!didTimeout && data.status === 200){
                        resolve(data);
                    }
                }).catch(() => {
                    if(didTimeout) return;
                    reject({status:400,message:"Application Server not connected"});
                });
            });
            servers.then((data) => {
                if(data.status === 200) {
                    this._isServer = data.result.server;
                    this._comps.pouchDBProvider.setServerDB(data.result.dbserver);
                    resolve(data);
                } else {
                    this._isServer = false;
                    this._comps.pouchDBProvider.setServerDB(false);
                    resolve({status:400,message:"Application Server not connected"});                                      
                }
            },() => {
                this._isServer = false;
                this._comps.pouchDBProvider.setServerDB(false);
                resolve({status:400,message:"Application Server not connected"});                
            })
        });
    }
    // reautentication
    _reauthenticate(server: any,options?:PDBOptions): Promise<any> {
        return new Promise<any>((resolve) => {
            const opts: PDBOptions = options ? options : null;
            this._isServer = server.status === 200 ? server.result.server : false;
            let dbserver:boolean = server.status === 200 ? server.result.dbserver : false;
            this._comps.pouchDBProvider.setServerDB(dbserver);
            this._comps.pouchDBProvider.getDB().then(async (db) => {
                if( db === null) {
                    let session: Session = await this._comps.sessionProvider.getSessionData();
                    if(session !== null) {
                        let now: number = Date.now();
                        if(session.expires > now || !this._isServer) {
                            let res:any = await this._comps.pouchDBProvider.initDatabase(POUCHDB_NAME,session.userDBs[COUCHDB_NAME],opts);
                            if(res.status === 200) {
                                resolve({status:200});
                            } else {
                                resolve({status:400 , message:res.message});
                            } 
                        } else {
                            resolve({status:400 , message:'Session expired'});                              
                        }
                    } else {
                        resolve({status:400 , message:'No session opened'});
                    }
                } else {
                    resolve({status:200});
                }
            });
        });
    }
    // authentication
    _authenticate(user:Credentials,options?:PDBOptions): Promise<any> {
        return new Promise<any>((resolve) => {
            const opts: PDBOptions = options ? options : null;
            let url:string = SERVER_ADDRESS + 'auth/login';
            let requestHeaders: any = { 'Content-Type': 'application/json' };
            let status:number;
            fetch(url, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify(user)
            }).then((res) => {
                status = res.status;
                return res.json();
            }).then(async (data:any) => {
                if(status === 200 && typeof data.token != 'undefined'){
                    let resp:any = await this._comps.pouchDBProvider.initDatabase(POUCHDB_NAME,data.userDBs[COUCHDB_NAME],opts);
                    if(typeof resp != 'undefined' ) {
                        if(resp.status === 200) {
                            resolve({status:200,result:data});
                        } else {
                            resolve({status:400 , message:resp.message});
                        } 
                    } else {
                        resolve({status:400 , message:"Error: PouchDB does not initialized"});
                    }          
                } else {
                    resolve({status:status , message:data.message});                    
                }
            }).catch((err) => {
                resolve({status:400,message:err.message});
            });
        });
    } 
    // registering
    _register(user:User,options?:PDBOptions): Promise<any> {
        return new Promise<any>((resolve) => {
            const opts: PDBOptions = options ? options : null;
            let url:string = SERVER_ADDRESS + 'auth/register';
            let requestHeaders: any = { 'Content-Type': 'application/json' };
            fetch(url, {
                    method: 'POST',
                    headers: requestHeaders,
                    body: JSON.stringify(user)
            }).then((res) => {
                if(res.ok) {
                    return res.json()
                } else {
                    return {status:res.status , message:res.statusText};
                }
            }).then(async (data) => {
                if(typeof data.token != 'undefined'){
                    let resp:any = await this._comps.pouchDBProvider.initDatabase(POUCHDB_NAME,data.userDBs[COUCHDB_NAME],opts);
                    if(typeof resp != 'undefined' ) {
                        if(resp.status === 200) {
                            resolve({status:200,result:data});
                        } else {
                            resolve({status:400 , message:resp.message});
                        } 
                    } else {
                        resolve({status:400 , message:"Error: PouchDB does not initialized"});
                    }          
                } else {
                    resolve({status:data.status , message:data.message});                    
                }
            }).catch((err) => {
                resolve({status:400 , message:err.message});                           
            });
        });
    }
    // form entries validation 
    _validateUsername(username:string): Promise<any> {
        return new Promise<any>((resolve) => {
            let url:string = SERVER_ADDRESS + 'auth/validate-username/' + username;
            let requestHeaders: any = { 'Content-Type': 'application/json' };
            fetch(url, {
                method: 'GET',
                headers: requestHeaders
            }).then((res) => {
                if(res.ok) {
                    return res.json()
                } else {
                    return {status:res.status , message:res.statusText};
                }
            }).then((data) => {
                if(typeof(data.ok) !== 'undefined') {
                    resolve({status:200});
                } else {
                    resolve({status:data.status , message:data.message + ': Username already in use'});                    
                }
            }).catch((err) => {
                resolve({status:400 , message:err.message});                           
            });
        });
    }
    _validateEmail(email:string): Promise<any> {
        return new Promise<any>((resolve) => {
            let url:string = SERVER_ADDRESS + 'auth/validate-email/' + email;
            let requestHeaders: any = { 'Content-Type': 'application/json' };
            fetch(url, {
                method: 'GET',
                headers: requestHeaders
            }).then((res) => {
                if(res.ok) {
                    return res.json()
                } else {
                    return {status:res.status , message:res.statusText};
                }
            }).then((data) => {
                if(typeof(data.ok) != 'undefined') {
                    resolve({status:200});
                } else {
                    resolve({status:data.status , message:data.message + ': Email already in use'});                    
                }
            }).catch((err) => {
                resolve({status:400 , message:err.message});                          
            });
        });
    }
    // handling logout event
    _logout(): Promise<any>{
        return new Promise<any>(async (resolve) => {
            let headers = new Headers();
            let session: Session = await this._comps.sessionProvider.getCurrentSession();
            if(session !== null) {
                headers.append('Authorization', 'Bearer ' + session.token + ':' + session.password);
                let url = SERVER_ADDRESS + 'auth/logout';                
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                }).then((res) => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        return {status:res.status , message:res.statusText};
                    }
                }).then((data) => {
                    this._isServer = false;
                    if(typeof(data.ok) != 'undefined') {
                        this._comps.sessionProvider.removeSessionData().then(async () => {
                            let res:any = await this._comps.pouchDBProvider.destroyDatabase();
                            if(res.status === 200) {
                                resolve({status:200, result:data.success});
                            } else {
                                resolve({status:400 , message:data.message});
                            } 
                        });
                    } else {
                        resolve({status:data.status , message:data.message + ': Not logged'});                    
                    }
                }).catch((err) => {
                    this._isServer = false;
                    resolve({status:400 , message:err.message});                           
                });
            } else {
                this._isServer = false;
                resolve({status:400 , message:"No session opened"});                                          
            }
        });
    } 
       
    // rendering
    render() {
        return (
            <slot />
        );
    }
}
