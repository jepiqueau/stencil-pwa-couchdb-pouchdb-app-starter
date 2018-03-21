import { flush, render } from '@stencil/core/testing';
import { AppPouchDB} from './app-pouchdb';
import { POUCHDB_NAME, SERVER_ADDRESS, DESIGN_DOCS } from '../../global/constants';
import { PDBOptions, News } from '../../global/interfaces'
import { mockDeleteDoc } from '../../../__mocks__/app-pouchdb';


var PouchDB = require('pouchDB-memory');
var fetchMock = require('jest-fetch-mock');

const textAttachement: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
Nullam blandit dolor libero, id scelerisque risus mollis ut. Proin tempus fermentum aliquet. \
Fusce bibendum imperdiet enim, ut hendrerit est finibus vitae. Suspendisse vitae ipsum sed ex \
lobortis sagittis. Proin purus erat, luctus ac nisl ut, gravida scelerisque orci. Sed tortor \
arcu, eleifend eget viverra in, interdum ut nisi. Pellentesque dictum magna sed sem pretium \
scelerisque. Pellentesque feugiat commodo laoreet. \
Proin aliquam at orci ac tristique. Praesent rhoncus eleifend dolor, condimentum congue \
sapien faucibus vitae. Nullam id mauris mauris. Nullam nec tristique velit. Nam nec purus \
consequat, convallis ante at, porta augue. Nulla nec lorem in ipsum lacinia dictum eget et \
diam. Vestibulum mattis libero velit, et eleifend risus placerat sit amet. Interdum et \
malesuada fames ac ante ipsum primis in faucibus.'

describe('app-pouchdb', () => {
    describe('instance', () => {
        let instance: any;
        let options: PDBOptions;
        beforeEach(async () => {
            instance = new AppPouchDB();
            options = {
                pouchDB: PouchDB,
                adapter: 'memory',
                designDocs: false
            };
        });
        afterEach(async () => {
            await instance.destroyDatabase();
            instance = null;
        });
        it('should build', () => {
            expect(instance).toBeTruthy();
        });
        it('PouchDB initialises', () => {
            expect(PouchDB).toBeDefined();
        });  
        it('Should open init "jpqtestdb" in memory', async () => {
            let res:any = await instance.initDatabase(POUCHDB_NAME,null,options);
            expect(res.status).toEqual(200);
            let db: any = await instance.getDB();
            expect(db).toBeDefined();
            expect(db.adapter).toEqual('memory');
            expect(db.name).toEqual('jpqtestdb');
            expect(db._remote).toBeFalsy();
        }); 
        it('Should not init PouchDB in memory', async () => {
            let res: any = await instance.initDatabase('',null,options);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual('Missing/invalid DB name');
            let db: any = await instance.getDB();
            expect(db).toBeUndefined;
        });
        it('should return CouchDB Server not connected', async() => {
            let url: string = SERVER_ADDRESS + 'auth/login';
            let headers: Headers = new Headers();
            headers.append('Content-Type', 'application/json');
    
            let body:any = {"status":400, "message":"CouchDB Server not connected"};
            let init:any = { "url":url, "ok":"false", "status" : 400 ,
             "statusText" : "Bad Request" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            instance.setServerDB(false);              
            const isServerDB = instance.isServerDBAlive();
            expect(isServerDB).toEqual(false);
                 
        });
        it('should return CouchDB Server connected', async() => {
            let url: string = SERVER_ADDRESS + 'auth/login';
            let headers: Headers = new Headers();
            headers.append('Content-Type', 'application/json');
    
            let body:any = {"status":200, "message":"CouchDB Server connected"};
            let init:any = { "url":url, "ok":"false", "status" : 401,
             "statusText" : "Unauthorized" ,"headers":headers};
            fetchMock.mockResponse(JSON.stringify(body),init);
            instance.setServerDB(true);              
            const isServerDB = instance.isServerDBAlive();
            expect(isServerDB).toEqual(true);                 
        });
        it('Should create a document News in db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options)
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            let result = await instance.createDoc(doc);
            expect(result.ok).toBeTruthy();
            expect(result.id).toBeDefined();
            expect(result.rev).toBeDefined();
        });
        it('Should return a document News by its Id from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            let result = await instance.createDoc(doc);
            if (result.ok) {
                let res:any = await instance.getDoc(result.id);
                expect(res.status).toEqual(200);
                expect(res.doc._id).toEqual(result.id);
                expect(res.doc._rev).toEqual(result.rev);
                expect(res.doc.type).toEqual("news");
                expect(res.doc.title).toEqual("Hello World");
                expect(res.doc.author).toEqual("Joe Smith");
                expect(res.doc.ellipsis).toEqual("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
                expect(res.doc.display).toBeTruthy();                 
            }
        });
        it('Should create a design document news in db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let result = await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            expect(result.ok).toBeTruthy();
            expect(result.id).toBeDefined();
            expect(result.rev).toBeDefined();
        });
        it('Should return one document News from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            await instance.createDoc(doc);
            await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            let queryOptions: any = {
                include_docs: true,
                descending: true
            };
            let response: Array<News> = await instance.queryDoc('news/display_by_date_created',queryOptions);
            expect(response.length).toEqual(1);
            expect(response[0].type).toEqual('news');
            expect(response[0].title).toEqual('Hello World');
            expect(response[0].author).toEqual('Joe Smith');
            expect(response[0].ellipsis).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            expect(response[0].display).toBeTruthy();
        });
        it('Should update one document News from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            await instance.createDoc(doc);
            await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            let queryOptions: any = {
                include_docs: true,
                descending: true
            };
            let response: Array<News> = await instance.queryDoc('news/display_by_date_created',queryOptions);
            let updDoc = response[0];
            updDoc.title = "Hello World Updated";
            let res = await instance.updateDoc(updDoc);
            expect(res.ok).toBeTruthy();
            expect(res.id).toBeDefined();
            expect(res.rev).toBeDefined();
            res = await instance.queryDoc('news/display_by_date_created',queryOptions);
            expect(res[0].type).toEqual('news');
            expect(res[0].title).toEqual('Hello World Updated');
            expect(res[0].author).toEqual('Joe Smith');
            expect(res[0].ellipsis).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            expect(res[0].display).toBeTruthy();
        });
        it('Should return no document when display updated to false from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            await instance.createDoc(doc);
            await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            let queryOptions: any = {
                include_docs: true,
                descending: true
            };
            let response: Array<News> = await instance.queryDoc('news/display_by_date_created',queryOptions);
            let updDoc = response[0];
            updDoc.display = false;
            await instance.updateDoc(updDoc);
            let res = await instance.queryDoc('news/display_by_date_created',queryOptions);
            expect(res.length).toEqual(0);
        });
        it('Should delete a document from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            await instance.createDoc(doc);
            await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            let queryOptions: any = {
                include_docs: true,
                descending: true
            };
            let response: Array<News> = await instance.queryDoc('news/display_by_date_created',queryOptions);
            let result = await instance.deleteDoc(response[0]);
            expect(result.ok).toBeTruthy();
            let res = await instance.queryDoc('news/display_by_date_created',queryOptions);
            expect(res.length).toEqual(0);
        });
        it('Should add a text attachment to a document from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            await instance.createDoc(doc);
            await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            let queryOptions: any = {
                include_docs: true,
                descending: true
            };
            let response: Array<News> = await instance.queryDoc('news/display_by_date_created',queryOptions);
            let res = await instance.addTextAttachments(response[0],textAttachement,'content');
            expect(res.ok).toBeTruthy();
            expect(res.id).toBeDefined();
            expect(res.rev).toBeDefined();
        });
        it('Should return a text attachment from a document from db', async () => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            let doc:News = {
                type: "news",
                title: "Hello World",
                author: "Joe Smith",
                ellipsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                display: true,                  
            }
            await instance.createDoc(doc);
            await instance.createDoc(JSON.parse(DESIGN_DOCS[0]));
            let queryOptions: any = {
                include_docs: true,
                descending: true
            };
            let response: Array<News> = await instance.queryDoc('news/display_by_date_created',queryOptions);
            let res = await instance.addTextAttachments(response[0],textAttachement,'content');
            let result = await instance.getTextAttachments(res.id,'content');
            expect(result.ok).toBeTruthy();
            expect(result.text).toEqual(textAttachement);
        });      
        it('Should check if design documents are in db', async (done) => {
            await instance.initDatabase(POUCHDB_NAME,null,options);
            await instance.initDesignDocuments();
            instance.checkDesignDocuments().then(() => {
                expect(instance.getIsDesignDocs()).toEqual([true])
                done();
            });
        });
    });
    describe('rendering', () => {
        let element: any;
        beforeEach(async () => {
            element = await render({
                components: [AppPouchDB],
                html: '<app-pouchdb></app-pouchdb>'
            });
        });
        it('should render', async () => {
            await flush(element);
            expect(element).not.toBeNull();
        });
            
    });
});