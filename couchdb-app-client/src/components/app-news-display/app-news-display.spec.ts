import { render, flush } from '@stencil/core/testing';
import { AppNewsDisplay } from './app-news-display';
import AppAuthMock from '../../../__mocks__/app-auth';
import AppSessionMock from '../../../__mocks__/app-session';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';
import AppConnMock from '../../../__mocks__/app-connection';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import LoadingCtrlMock from '../../../__mocks__/loadingcontroller';
import NavCmptMock from '../../../__mocks__/nav';
import { Session, News } from '../../global/interfaces';

describe('app-news-display', () => {
    it('should build', () => {
        expect(new AppNewsDisplay()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let page: HTMLElement;
        let appSession: any;
        let appPouchDB: any;
        let appAuth: any;
        let appConn:any;
        let errCtrl: any;
        let navCmpt: any;
        let loadingCtrl: any;
        let mocks: any;
        let news: News = {
            _id: "3925738c-8537-44ab-a771-2a73f87fb61d",
            _rev: "2-65642c4e1b734ae698ddd6c7af46c107",
            _attachments: {
                "content.text": {
                  "content_type": "text/plain",
                  "revpos": 2,
                  "digest": "md5-WdKkl1pkk9ip5P+JKUp8Eg==",
                  "length": 684,
                  "stub": true
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
        let news1: News = {
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
            let session: Session = {
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
        beforeEach(async () => {
            element = await render({
                components: [AppNewsDisplay],
                html: '<app-news-display></app-news-display'
            });
            page = element.querySelector('ion-page');
            appAuth = new AppAuthMock();
            appSession = new AppSessionMock();
            appPouchDB = new AppPouchDBMock();
            appConn = new AppConnMock();
            errCtrl = new ErrCtrlMock();
            loadingCtrl = new LoadingCtrlMock();
            navCmpt = new NavCmptMock();
            mocks = {
                authProvider:appAuth,
                sessionProvider:appSession,
                pouchDBProvider:appPouchDB,
                errorCtrl:errCtrl,
                loadingCtrl:loadingCtrl,
                navCmpt:navCmpt,
                connectionProvider: appConn 
            }
        });
        afterEach(async () => {
            appAuth.restoreMock();
            appSession.restoreMock();
            appPouchDB.restoreMock();
            appConn.restoreMock();
            errCtrl.restoreMock();
            navCmpt.restoreMock();
            loadingCtrl.restoreMock();
            appAuth.resetMock();
            appSession.resetMock();
            appPouchDB.resetMock();
            appConn.resetMock(); 
            errCtrl.resetMock();
            navCmpt.resetMock();
            loadingCtrl.resetMock();
            
        });
        it('should have a ion-page component', async () => {
            await flush(element);
            expect(page).not.toBeNull();
        });
        it('should have an app-header component', async () => {
            await flush(element);
            let header: HTMLElement = page.querySelector('app-header');
            expect(header).not.toBeNull();
        });
        it('should have an ion-content component', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            expect(content).not.toBeNull();
        });
        it('should not have a news-display-card ', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLIonCardElement = content.querySelector('#news-display-card'); 
            expect(card).toBeNull();
        });
        it('should return a "fake" card ', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLElement = content.querySelector('#fake-card'); 
            expect(card).not.toBeNull();
        });
        it('should have a news-display-card ', async () => {
            element.setNews([news]);
            await element.initMocks(mocks);
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLIonCardElement = content.querySelector('#news-display-card'); 
            expect(card).not.toBeNull();
        });
        it('should have a title in the ion-card-header ', async () => {
            element.setNews([news]);
            await element.initMocks(mocks);
            await flush(element);
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLIonCardElement = content.querySelector('#news-display-card');
            let header: HTMLIonCardHeaderElement = card.querySelector('ion-card-header');
            let title: HTMLIonCardTitleElement = header.querySelector('ion-card-title');
            expect(header).toBeDefined();
            expect(title).toBeDefined();
            expect(title.textContent).toEqual("News for testing");
        });
        it('should have a ion-card-content with two childs ', async () => {
            element.setNews([news]);
            await element.initMocks(mocks);
            await flush(element);
            page = element.querySelector('ion-page');
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLIonCardElement = content.querySelector('#news-display-card');
            let cardContent: HTMLIonCardContentElement = card.querySelector('ion-card-content');
            expect(cardContent).toBeDefined();
            let inputs:HTMLCollection = cardContent.children; 
            expect(inputs.length).toEqual(2);
            expect(inputs[0].getAttribute('id')).toEqual('ellipsis');
            expect(inputs[0].textContent).toEqual('Hello World!')
            expect(inputs[1].getAttribute('id')).toEqual('button');
        });
        it('should return status 400 when server disconnected and session null', async () => {
            await flush(element);
            appAuth.responseMock({status:400,message:'Application Server not connected'});
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
        });
        it('should return status 400 when Application server connected DBServer disconnected and session null', async () => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:false}};
            appAuth.responseMock(server);
            await element.initMocks(mocks);
            await element.isServersConnected();
            expect(errCtrl.getMessageMock()).toEqual("Application Server not connected");                    
        });
        it('should return status 200 when servers are connected and session exists', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toBeNull;
                    done();
                });
            });
        });
        it('should return status 200 when servers are disconnected and session exists', async (done) => {
            await flush(element);
            let server:any = {status:400,message:'Application Server not connected'};
            element.initMocks(mocks).then(() => {
                appAuth.dataReauthenticateMock({status:200});
                appSession.saveSessionData(session);
                appAuth.responseMock(server);
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toBeNull;
                    expect(errCtrl.getMessageMock()).toEqual("Working Offline");                    
                    done();
                });
            });
        });
        it('should return status 400 when servers are connected and session expired', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            session.issued = 1517680659920;
            session.expires = 1517767059920;
            element.initMocks(mocks).then(() => {
                appSession.saveSessionData(session);
                appAuth.dataReauthenticateMock({status:400,message: 'Session expired'});
                appAuth.responseMock(server);
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toEqual('app-login');
                    expect(errCtrl.getMessageMock()).toEqual("Session expired");                    
                    done();
                });
            });
         });
        it('should return status 400 when servers are connected and no session opended', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            element.initMocks(mocks).then(() => {
                appAuth.dataReauthenticateMock({status:400,message: 'No session opened'});
                appAuth.responseMock(server);
                element.isServersConnected().then(() => {
                    expect(navCmpt.getPageMock()).toEqual('app-login');
                    expect(errCtrl.getMessageMock()).toEqual("No session opened");                    
                    done();
                });
            });
        });
        it('should return a "fake" card if no news store in PouchDB', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let content: HTMLElement = page.querySelector('ion-content');
                    let card: HTMLElement = content.querySelector('#fake-card'); 
                    expect(card).not.toBeNull();
                    done();
                });
            });
        });
        it('should display two cards from PouchDB', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            await appPouchDB.createDoc(news);        
            await appPouchDB.createDoc(news1);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let retNews: Array<News> = await element.getNews();
                    expect(retNews.length).toEqual(2);
                    element.setNews(retNews);
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let list: HTMLIonListElement = content.querySelector('ion-list');
                    let cards: NodeListOf<HTMLIonCardElement>  = list.querySelectorAll("ion-card");
                    expect(cards.length).toEqual(2);
                    done();
                });
            });
        });
        it('should display the fist card with title = "News for testing" ', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            await appPouchDB.createDoc(news);        
            await appPouchDB.createDoc(news1);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let retNews: Array<News> = await element.getNews();
                    element.setNews(retNews);
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let list: HTMLIonListElement = content.querySelector('ion-list');
                    let cards: NodeListOf<HTMLIonCardElement>  = list.querySelectorAll("ion-card");
                    let titleEl = cards[0].querySelector('ion-card-title');
                    let ellipsisEl = cards[0].querySelector('#ellipsis');
                    expect(titleEl.textContent).toEqual("News for testing");
                    expect(ellipsisEl.textContent).toEqual("Hello World!");
                    done();
                });
            });
        });
        it('should display the second card with title = "Second News for Testing" ', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            await appPouchDB.createDoc(news);        
            await appPouchDB.createDoc(news1);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let retNews: Array<News> = await element.getNews();
                    element.setNews(retNews);
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let list: HTMLIonListElement = content.querySelector('ion-list');
                    let cards: NodeListOf<HTMLIonCardElement>  = list.querySelectorAll("ion-card");
                    let titleEl = cards[1].querySelector('ion-card-title');
                    let ellipsisEl = cards[1].querySelector('#ellipsis');
                    expect(titleEl.textContent).toEqual("Second News for Testing");
                    expect(ellipsisEl.textContent).toEqual("Proin aliquam at orci ac tristique  ...");
                    done();
                });
            });
        });
        it('should route to the item page when clicking on tyhe more button', async (done) => {
            await flush(element);
            let server:any = {status:200,result:{server:true,dbserver:true}};
            await appSession.saveSessionData(session);
            appAuth.dataReauthenticateMock({status:200});
            appAuth.responseMock(server);
            await appPouchDB.createDoc(news);        
            await appPouchDB.createDoc(news1);
            element.initMocks(mocks).then(() => {
                element.isServersConnected().then(async () => {
                    let retNews: Array<News> = await element.getNews();
                    element.setNews(retNews);
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let list: HTMLIonListElement = content.querySelector('ion-list');
                    let cards: NodeListOf<HTMLIonCardElement>  = list.querySelectorAll("ion-card");
                    let buttonEl = cards[0].querySelector('#button');
                    expect(buttonEl).toBeDefined()
                    let params:News = {
                        _id : news._id,
                        title: news.title,
                        author: news.author,
                        dateCreated: news.dateCreated
                    };
                    element.handleClick(params);
                    expect(navCmpt.getPageMock()).toEqual('app-news-item');                                    
                    expect(navCmpt.getDataMock().itemObj).toEqual(params);                                    
                    done();
                });
            });
        });      
    });
});
