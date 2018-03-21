import { mockElement } from '@stencil/core/testing';

export const mockGetEl = mockElement('app-pouchdb') as HTMLElement;
let db : any = null;
let isServerDB: boolean = false;
let res: any = null;
let remote: boolean = false;
let documents: Array<string> = [];
let attachments: Array<string> = [];
let indexAttach: number;
let viewPath:string = null;
let option:any = null;
export const mockIsServerDBAlive = jest.fn().mockImplementation(() => {
    return isServerDB;
});
export const mockSetServerDB = jest.fn().mockImplementation((response) => {
    isServerDB = response;
});
export const mockGetDB = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        resolve(db);
    });
});
export const mockInitDatabase = jest.fn().mockImplementation((name,isRemote,options) => {
    let dbName = name;
    remote = isRemote;
    return new Promise((resolve ) => {
        if(dbName !== null) {
            db = new options.pouchDB(dbName, {
                auto_compaction: true,
                adapter: options.adapter
            });
        }
        resolve(res);
    });
});
export const mockDestroyDatabase = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        db = null;
        resolve(res);
    });
});
export const mockCreateDoc = jest.fn().mockImplementation((doc:any) => {
    if(res !== null && res.createDoc) return Promise.resolve({ok:false,message:res.createDoc});
    documents.push(JSON.stringify(doc));
    return Promise.resolve({ok:true,id:doc._id,rev:doc._rev});
});
export const mockUpdateDoc = jest.fn().mockImplementation(async (doc:any) => {
    let oldDoc = await mockGetDoc(doc._id);
    let i:number = documents.indexOf(JSON.stringify(oldDoc.doc));
    documents.splice(i, 1, JSON.stringify(doc));
    return Promise.resolve({ok:true,id:doc._id,rev:doc._rev});
});
export const mockDeleteDoc = jest.fn().mockImplementation(async (doc:any) => {
    let oldDoc = await mockGetDoc(doc._id);
    let i:number = documents.indexOf(JSON.stringify(oldDoc.doc));
    documents.splice(i, 1);
    return Promise.resolve({ok:true,id:doc._id,rev:doc._rev});
});
export const mockQueryDoc = jest.fn().mockImplementation((view:string,opt:any) => {
    viewPath = view;
    option = opt;
    let docs:Array<any> = [];
    documents.forEach((doc) => {
        docs.push(JSON.parse(doc));
    })
    return Promise.resolve(docs);
});
export const mockGetDoc = jest.fn().mockImplementation((docId:string) => {
    const result = documents.filter(doc => JSON.parse(doc)._id === docId);
    if(result.length > 0) {
        return Promise.resolve({status:200,doc:JSON.parse(result[0])});
    } else {
        return Promise.resolve({status:409,message:'not_found'});        
    }
});
export const mockAddTextAttachments = jest.fn().mockImplementation(async (doc:any,text:string,name:string) => {
    if(res !== null && res.addTextAttach) return Promise.resolve({ok:false,message:res.addTextAttach});
    let curDoc: any = await mockGetDoc(doc._id);
    let type: string = name + '.text'
    let result: any = await mockGetTextAttachments(curDoc.doc._id,name);
    let attach: any = {};
    if(result.ok) attachments.splice(result.index,1); 
    attach._id = curDoc.doc._id
    attach[type] = {};
    attach[type].text = text;
    attachments.push(JSON.stringify(attach));
    return Promise.resolve({ok:true,id:doc._id,rev:doc._rev});
});
export const mockGetTextAttachments = jest.fn().mockImplementation(async (docId:string,name:string) => {
    let type: string = name + '.text'
    let curAttachments = attachments.filter((attch,index) => {
        let obj = JSON.parse(attch);
        if(obj._id === docId && obj[type]) {
            indexAttach = index;
            return attch;
        } 
    });
    let result:Array<any> = curAttachments.length > 0 ? curAttachments : null;
    return Promise.resolve(result != null ? 
        {ok:true, text:JSON.parse(result[0])[type].text,index:indexAttach} : {ok:false});
});


export const restoreMock = jest.fn().mockImplementation(() => {
    res = null;
    indexAttach = null;
    documents = [];
    attachments = [];
});
export const setTextAttachmentsMock = jest.fn().mockImplementation((docId:string,text:string,name:string) => {
    let type: string = name + '.text'
    let attach: any = {};
    attach._id = docId
    attach[type] = {};
    attach[type].text = text;
    attachments.push(JSON.stringify(attach));
});

export const responseMock = jest.fn().mockImplementation((response) => {
    res = response;
});
export const resetMock = jest.fn().mockReset();

const mockPouchDBProvider = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        isServerDBAlive: mockIsServerDBAlive,
        setServerDB : mockSetServerDB,
        getDB: mockGetDB,
        initDatabase: mockInitDatabase,
        destroyDatabase: mockDestroyDatabase,
        createDoc: mockCreateDoc,
        updateDoc: mockUpdateDoc,
        deleteDoc: mockDeleteDoc,
        queryDoc: mockQueryDoc,
        getDoc: mockGetDoc,
        addTextAttachments: mockAddTextAttachments,
        getTextAttachments: mockGetTextAttachments,
        setTextAttachmentsMock: setTextAttachmentsMock,
        restoreMock: restoreMock,
        responseMock: responseMock,
        resetMock: resetMock
    };
});

export default mockPouchDBProvider;
