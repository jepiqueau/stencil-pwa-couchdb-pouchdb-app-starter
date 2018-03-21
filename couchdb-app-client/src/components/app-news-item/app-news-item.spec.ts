import { render, flush } from '@stencil/core/testing';
import { mockWindow, mockDocument } from '@stencil/core/testing';
import { AppNewsItem } from './app-news-item';
import AppPouchDBMock from '../../../__mocks__/app-pouchdb';
import ErrCtrlMock from '../../../__mocks__/errorcontroller';
import NavCtrlMock from '../../../__mocks__/navcontroller';
import NavCmptMock from '../../../__mocks__/nav';
import { News } from '../../global/interfaces';
import { getFromDateISOStringToEnglish } from '../../helpers/utils';

describe('app-news-item', () => {
    it('should build', () => {
        expect(new AppNewsItem()).toBeTruthy();
    });

    describe('rendering', () => {
        let element: any;
        let page: HTMLElement;
        let appPouchDB: any;
        let errCtrl: any;
        let navCtrl: any;
        let navCmpt : any;
        let win: Window;
        let dom: Document;
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
        beforeEach(async () => {
            element = await render({
                components: [AppNewsItem],
                html: '<app-news-item></app-news-item'
            });
            page = element.querySelector('ion-page');
            appPouchDB = new AppPouchDBMock();
            errCtrl = new ErrCtrlMock();
            navCtrl = new NavCtrlMock();
            navCmpt = new NavCmptMock();
            win = mockWindow();
            dom = mockDocument(win);
            mocks = {
                pouchDBProvider:appPouchDB,
                errorCtrl: errCtrl,
                navCmpt: navCmpt
            }
        });
        afterEach(() => {
            appPouchDB.restoreMock();
            errCtrl.restoreMock();
            navCtrl.restoreMock();
            navCmpt.restoreMock();
            appPouchDB.resetMock();
            errCtrl.resetMock();
            navCtrl.resetMock();
            navCmpt.resetMock();            
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
        it('should not have a news-item-card ', async () => {
            await flush(element);
            let content: HTMLElement = page.querySelector('ion-content');
            let card: HTMLIonCardElement = content.querySelector('#news-item-card'); 
            expect(card).toBeNull();
        });
        it('should return a "fake" card ', async () => {
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            element.initMocks(mocks).then(async () => {
                await flush(element);
                let content: HTMLElement = page.querySelector('ion-content');
                let card: HTMLElement = content.querySelector('#fake-card'); 
                expect(card).not.toBeNull();
            });
        });
        it('should have a news-item-card ', async (done) => {           
            let params:News = {
                _id : news._id,
                title: news.title,
                author: news.author,
                dateCreated: news.dateCreated
              }
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            await nav.push('app-news-item',{'itemObj':params});
            expect(nav.getActive().data['itemObj']).toEqual(params);
            element.initMocks(mocks).then(() => {
                element.getNavData().then(async () => {
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let card: HTMLIonCardElement = content.querySelector('#news-item-card'); 
                    expect(card).not.toBeNull();
                    done();
                });
            });
        });
        it('should have a title in the card  ', async (done) => {           
            let params:News = {
                _id : news._id,
                title: news.title,
                author: news.author,
                dateCreated: news.dateCreated
            }
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            await nav.push('app-news-item',{'itemObj':params});
            expect(nav.getActive().data['itemObj']).toEqual(params);
            element.initMocks(mocks).then(() => {
                element.getNavData().then(async () => {
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let card: HTMLIonCardElement = content.querySelector('#news-item-card'); 
                    let titleEl: HTMLIonCardTitleElement = card.querySelector('ion-card-title'); 
                    expect(titleEl).not.toBeNull();
                    expect(titleEl.textContent).toEqual(params.title);
                    done();
                });
            });
        });
        it('should have a subtitle in the card  ', async (done) => {           
            let params:News = {
                _id : news._id,
                title: news.title,
                author: news.author,
                dateCreated: news.dateCreated
            }
            let date:string = getFromDateISOStringToEnglish(params.dateCreated);
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            await nav.push('app-news-item',{'itemObj':params});
            expect(nav.getActive().data['itemObj']).toEqual(params);
            element.initMocks(mocks).then(() => {
                element.getNavData().then(async () => {
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let card: HTMLIonCardElement = content.querySelector('#news-item-card'); 
                    let subTitleEl: HTMLIonCardSubtitleElement = card.querySelector('ion-card-subtitle'); 
                    expect(subTitleEl).not.toBeNull();
                    expect(subTitleEl.textContent).toEqual(date + ' / ' +  params.author);
                    done();
                });
            });
        });
       it('should not have a text attachment in the card  ', async (done) => {           
            let params:News = {
                _id : news._id,
                title: news.title,
                author: news.author,
                dateCreated: news.dateCreated
            }
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            await nav.push('app-news-item',{'itemObj':params});
            expect(nav.getActive().data['itemObj']).toEqual(params);
            element.initMocks(mocks).then(() => {
                element.getNavData().then(async () => {
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let card: HTMLIonCardElement = content.querySelector('#news-item-card'); 
                    let contentEl: HTMLIonItemElement = card.querySelector('.content');
                    expect(contentEl).toBeNull(); 
                    expect(errCtrl.getMessageMock()).toEqual("No Attachments for this News document");
                    done();
                });
            });                    
        });
        it('should have a text attachment in the card  ', async (done) => {           
            let params:News = {
                _id : news._id,
                title: news.title,
                author: news.author,
                dateCreated: news.dateCreated
            }
            const res = await appPouchDB.createDoc(params); 
            const text: string = "Hello World!" ;      
            appPouchDB.setTextAttachmentsMock(res.id,text,'content');
            const retText:any = await appPouchDB.getTextAttachments(res.id,'content');        
            expect(retText.text).toEqual(text);
            let nav:any = await navCtrl.getNav(); 
            nav.el.setAttribute('id','navId');
            expect(nav.el.getAttribute('id')).toEqual('navId');
            await dom.body.appendChild(nav.el);
            expect(dom.body.querySelector('#navId')).toBeTruthy();
            await nav.push('app-news-item',{'itemObj':params});
            expect(nav.getActive().data['itemObj']).toEqual(params);
            element.initMocks(mocks).then(() => {
                element.getNavData().then(async () => {
                    await flush(element);
                    let content: HTMLElement = page.querySelector('ion-content');
                    let card: HTMLIonCardElement = content.querySelector('#news-item-card'); 
                    let contentEl: HTMLIonItemElement = card.querySelector('.content');
                    expect(contentEl.textContent).toEqual(text);
                    done();
                });
            }); 
        });
    });
});
