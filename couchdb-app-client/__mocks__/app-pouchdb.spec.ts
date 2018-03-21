import AppPouchDBMock from './app-pouchdb';

describe('app-pouchDBMock', () => {
    let appPouchDB: any;
    let news: any = {
        _id: "3925738c-8537-44ab-a771-2a73f87fb61d",
        _rev: "2-65642c4e1b734ae698ddd6c7af46c107",
        _attachments: {
            "content.text": {
              content_type: "text/plain",
              revpos: 2,
              digest: "md5-WdKkl1pkk9ip5P+JKUp8Eg==",
              length: 684,
              stub: true
            }
          },
        type: "news",
        title: "News for testing",
        author: "Jeep",
        ellipsis: "Hello World!",
        display: true,
        dateCreated: "2018-03-06T18:13:44.603Z",
        dateUpdated: "2018-03-06T18:13:44.603Z"                  
    };
    let news1: any = {
        _id: "7e8a3232-8d73-4ca2-9123-263f80540e20",
        _rev: "2-adce1b076da8d6d4a82d27c294a31bcb",
        type: "news",
        title: "Second News for Testing",
        author: "JeepQ",
        ellipsis: "Proin aliquam at orci ac tristique  ...",
        display: true,
        dateCreated: "2018-03-06T14:41:52.885Z",
        dateUpdated: "2018-03-06T14:41:52.885Z",
        _attachments: {
            "content.text": {
                content_type: "text/plain",
                revpos: 2,
                digest: "md5-UHgQHauR9PEqZN/xdcp9eQ==",
                length: 639,
                stub: true
            }
        }
    }
    beforeEach(async () => {
        appPouchDB = new AppPouchDBMock();
    });
    afterEach(async () => {
        appPouchDB.restoreMock();
        appPouchDB.resetMock();
    });
    it('should build', () => {
        expect(appPouchDB).toBeTruthy();
    });
    it('When appPouchDB created show have el= app-pouchdb', () => {
        expect(appPouchDB.el.tagName).toEqual('APP-POUCHDB');
    });
    it('should not create a doc', async () => {
        appPouchDB.responseMock({createDoc:'Error: No News document created'});
        const result = await appPouchDB.createDoc(news);        
        expect(result.ok).toBeFalsy();
        expect(result.message).toEqual("Error: No News document created");
    });
    it('should create a doc', async () => {
        const result = await appPouchDB.createDoc(news);        
        expect(result.ok).toBeTruthy();
        expect(result.id).toEqual("3925738c-8537-44ab-a771-2a73f87fb61d");
        expect(result.rev).toEqual("2-65642c4e1b734ae698ddd6c7af46c107");
    });
    it('should get a doc from its _id', async () => {
        const result = await appPouchDB.createDoc(news);
        const res = await appPouchDB.getDoc(result.id);
        expect(res.status).toEqual(200);
        expect(res.doc._id).toEqual("3925738c-8537-44ab-a771-2a73f87fb61d");
        expect(res.doc._rev).toEqual("2-65642c4e1b734ae698ddd6c7af46c107");
        expect(res.doc.title).toEqual("News for testing");
    });
    it('should update a doc', async () => {
        const result = await appPouchDB.createDoc(news);        
        const retDoc = await appPouchDB.getDoc(result.id);
        retDoc.doc.title = "Test Update Document";
        const res = await appPouchDB.updateDoc(retDoc.doc);
        expect(res.ok).toBeTruthy();
        expect(res.id).toEqual("3925738c-8537-44ab-a771-2a73f87fb61d");
        expect(res.rev).toEqual("2-65642c4e1b734ae698ddd6c7af46c107");
        const updDoc = await appPouchDB.getDoc(res.id);
        expect(updDoc.doc._id).toEqual("3925738c-8537-44ab-a771-2a73f87fb61d");
        expect(updDoc.doc._rev).toEqual("2-65642c4e1b734ae698ddd6c7af46c107");
        expect(updDoc.doc.title).toEqual("Test Update Document");
    });
    it('should delete a doc', async () => {
        const result = await appPouchDB.createDoc(news);        
        const retDoc = await appPouchDB.getDoc(result.id);
        const res = await appPouchDB.deleteDoc(retDoc.doc);
        expect(res.ok).toBeTruthy();
        expect(res.id).toEqual("3925738c-8537-44ab-a771-2a73f87fb61d");
        expect(res.rev).toEqual("2-65642c4e1b734ae698ddd6c7af46c107");
    });
    it('should return two docs from query', async () => {
        await appPouchDB.createDoc(news);        
        await appPouchDB.createDoc(news1);
        const result = await appPouchDB.queryDoc('news/display_by_date_created',{})        
        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(news._id);
        expect(result[0]._rev).toEqual(news._rev);
        expect(result[0].title).toEqual(news.title);
        expect(result[1]._id).toEqual(news1._id);
        expect(result[1]._rev).toEqual(news1._rev);
        expect(result[1].title).toEqual(news1.title);
    });
    it('should not attach a text to a doc ', async () => {
        appPouchDB.responseMock({addTextAttach:'Error: News document created with no Text Attachment'});
        const res = await appPouchDB.createDoc(news); 
        const retDoc = await appPouchDB.getDoc(res.id);
        const text: string = "Hello World! this is a test" ;      
        const result = await appPouchDB.addTextAttachments(retDoc.doc,text,'content');       
        expect(result.ok).toBeFalsy();
        expect(result.message).toEqual('Error: News document created with no Text Attachment');
    });
    it('should attach a text to a doc ', async () => {
        const res = await appPouchDB.createDoc(news); 
        const retDoc = await appPouchDB.getDoc(res.id);
        const text: string = "Hello World! this is a test" ;      
        const result = await appPouchDB.addTextAttachments(retDoc.doc,text,'content');       
        expect(result.ok).toBeTruthy();
        expect(result.id).toEqual(retDoc.doc._id);
        expect(result.rev).toEqual(retDoc.doc._rev);
    });
    it('should return the text attachment from a doc ', async () => {
        const res = await appPouchDB.createDoc(news); 
        const retDoc = await appPouchDB.getDoc(res.id);
        const text: string = "Hello World! this is a test" ;      
        const result = await appPouchDB.addTextAttachments(retDoc.doc,text,'content');
        const retText:any = await appPouchDB.getTextAttachments(result.id,'content');        
        expect(retText.text).toEqual(text);
    });
    it('should update a text attachment from a doc ', async () => {
        const res = await appPouchDB.createDoc(news); 
        const retDoc = await appPouchDB.getDoc(res.id);
        const text: string = "Hello World! this is a test" ;      
        const result = await appPouchDB.addTextAttachments(retDoc.doc,text,'content');
        const retText:any = await appPouchDB.getTextAttachments(result.id,'content');        
        expect(retText.text).toEqual(text);
        const text1:string = "Hello World! this is an update test" ;       
        const updateRes = await appPouchDB.addTextAttachments(retDoc.doc,text1,'content');
        expect(updateRes).toBeTruthy();
        expect(updateRes.id).toEqual(retDoc.doc._id);
        expect(updateRes.rev).toEqual(retDoc.doc._rev);
        const retText1:any = await appPouchDB.getTextAttachments(updateRes.id,'content');        
        expect(retText1.text).toEqual(text1);
    });
    it('should set a text attachment to a doc ', async () => {
        const res = await appPouchDB.createDoc(news); 
        const text: string = "Hello World! this is a test" ;      
        appPouchDB.setTextAttachmentsMock(res.id,text,'content');
        const retText:any = await appPouchDB.getTextAttachments(res.id,'content');        
        expect(retText.text).toEqual(text);
    });

});