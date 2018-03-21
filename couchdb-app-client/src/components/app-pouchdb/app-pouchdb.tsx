import { Component, Method } from '@stencil/core';
import { PDBOptions } from '../../global/interfaces';
import { DESIGN_DOCS } from '../../global/constants';
//import PouchDB from 'pouchdb-browser'; // doesn't work problem with debug not selecting browser and crypto in uuid
declare var PouchDB;

@Component({
  tag: 'app-pouchdb',
  styleUrl: 'app-pouchdb.scss'
})
export class AppPouchDB {
    private _db: any = null;
    private _remote: string = null;
    private _isServerDB: boolean = false;
    private _isDesignDocs: Array<boolean> = [];
    private _designDocs: Array<any> = [];

    @Method()
    isServerDBAlive(): boolean {
        return this._isServerDB;
    }
    @Method()
    getIsDesignDocs(): Array<boolean> {
        return this._isDesignDocs;
    }

    @Method()
    setServerDB(alive:boolean) {
        this._isServerDB = alive;
    }

    @Method()
    getDB (): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve(this._db);
        });
    }
    @Method()
    checkDesignDocuments (): Promise<void> {
        return this._checkDesignDocuments();
    }
    @Method()
    initDesignDocuments (): Promise<void> {
        return this._initDesignDocs();
    }

    @Method()
    initDatabase(pouchDBName:string,remoteDB?: string,options?:PDBOptions ): Promise<any> {
        return new Promise<any>(async (resolve) => {
            const dbName: string = pouchDBName.length > 0 ? pouchDBName : null;
            this._remote = remoteDB ? remoteDB : null;
            const opts:PDBOptions = options !== null ? options : null;
            const adapt: string = opts !== null ? opts.adapter : 'idb';
            const pDB: any = opts !== null ? opts.pouchDB : PouchDB;
            const ddoc: boolean = opts !== null ? opts.designDocs : true;
            if(dbName !== null) {
                this._db = new pDB(dbName, {
                    auto_compaction: true,
                    adapter: adapt
                });
                if(this._db !== null) {
                    // check if design documents exist, if not create them
                    if(ddoc) await this.checkDesignDocuments();
                    // deal with remote syncing CouchDB => PouchDB => CouchDB
                    if(this._isServerDB && this._remote !== null) {
                        this.initRemoteSync(this._remote);
                    }
                    resolve({status:200});
                } else {
                    resolve({status:400, message:'local pouchdb not opened'});
                }
            } else {
                resolve({status:400, message:'Missing/invalid DB name'});            
            }
        });
    }

    @Method()
    initRemoteSync(remote:string) {
        const opts:any = { live: true, retry: true , /*filter: 'app/replicate'*/};

        // do one way, one-off sync from the server until completion
        this._db.replicate.from(remote).on('complete', () => {
          // then two-way, continuous, retriable sync
          this._db.sync(remote, opts)
            .on('error', () => {console.log('Error in synchronization');});
        }).on('error', () => {console.log('Error in replication');});;
    }

    @Method()
    destroyDatabase() : Promise<any> {
        return new Promise<any>(async (resolve) => {
            if(this._db !== null) {
                try {
                    await this._db.destroy();
                    this._db = null;
                    resolve({status: 200});                    
                }
                catch(e)
                {
                    resolve({status: 400, message:"Error in closing PouchDB database"})
                }
            } else {
                resolve({status: 400, message:"No PouchDB database opened"})
            }
        });
    }
    @Method()
    createDoc(doc:any): Promise<any>  {
        return new Promise<any> ((resolve) => {
            this._db.post(doc).then((res) => {
                resolve(res);
            }).catch((err) => {
                resolve(err);
            })
        });
    } 
    @Method()
    updateDoc(doc:any): Promise<any> {
        return new Promise<any> ((resolve) => {
            this._db.put(doc).then((res) => {
                resolve(res);
            }).catch((err) => {
                resolve(err);
            })
        });
    }
    @Method()  
    deleteDoc(doc:any): Promise<any> {
        return new Promise<any> ((resolve) => {
            this._db.remove(doc).then((res) => {
                resolve(res);
            }).catch((err) => {
                resolve(err);
            })
        });
    }
    @Method()  
    queryDoc(path:string,options:any): Promise<any> {
        return Promise.resolve(this._db.query(path,options).then(data => {
            return data.rows.map(row => {
                return row.doc;
            });
        }));
    }
    @Method()  
    getDoc(docId:string): Promise<any> {
        return new Promise<any> ((resolve) => {
            this._db.get(docId).catch( (err) => {
                if (err.name === 'not_found') {
                    resolve({status:409,message:'not_found'});
                } else { // hm, some other error
                  throw err;
                }
            }).then((doc) => {
                resolve({status:200,doc:doc});
            }).catch((err) => {
                resolve({status:400,message:err.message});
            });    
        });
    }
    @Method()
    addTextAttachments(doc:any,text:string,name:string): Promise<any> {
        if(!doc._attachments) doc._attachments = {};
        doc._attachments[name+'.text'] = {
            content_type: 'text/plain',
            data: window.btoa(text)
        }
        return Promise.resolve(this.updateDoc(doc));
    }
    @Method()
    getTextAttachments(docId:string,name:string): Promise<any> {
        return Promise.resolve(this._db.get(docId, {attachments: true}).then(res => {
            if(!res._attachments || !res._attachments[name+'.text']) return {ok:false};
            return {ok: true, text:window.atob(res._attachments[name+'.text'].data)};
        }));
    }
    async componentWillLoad() {
        await this.initDesignDocuments();
    }
    _initDesignDocs(): Promise<void> {
        return new Promise<any> ((resolve) => {
            this._designDocs = [];
            this._isDesignDocs = [];
            for (let i:number = 0;i < DESIGN_DOCS.length;i++) {
            this._designDocs = [...this._designDocs,JSON.parse(DESIGN_DOCS[i])];
            this._isDesignDocs = [...this._isDesignDocs,false];
            }
            resolve();
        });
    }
    async _checkDesignDocuments(): Promise<void> {
        let tmp:boolean;
        for (let i:number = 0;i < this._isDesignDocs.length;i++) {
            if(!this._isDesignDocs[i]) {
                this._isDesignDocs.splice(i,1);
                let res = await this.getDoc(this._designDocs[i]._id);
                if(res.status === 409) {
                    let result = await this.createDoc(this._designDocs[i]);
                    if(result.ok) {
                        tmp = true;              
                    } else {
                        tmp = false;                         
                    }
                } else if (res.status === 200) {
                    tmp = true;              
                } else {
                    tmp = false;                                             
                }
                this._isDesignDocs = [...this._isDesignDocs,tmp];
            }
        }
        return Promise.resolve();
    }    
    // rendering
    render() {
        return (
          <slot />
        );
    }
}    
