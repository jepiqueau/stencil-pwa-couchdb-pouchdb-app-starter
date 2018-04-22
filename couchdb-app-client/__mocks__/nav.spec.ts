import { mockWindow, mockDocument } from './mock';
import NavMock from './nav';
import { mockElement } from './mock';

describe('nav', () => {
    let nav: any;
    let window: any;
    let dom: Document;
    beforeEach(() => {
        nav = new NavMock();        
        window = mockWindow();
        dom = mockDocument();
      });
    afterEach(() => {
        nav.restoreMock();
        nav.resetMock();
        nav = null;        
        window = null;
        dom = null;
      });
    it('should create a Nav from mock', () => {
        expect(nav).toBeDefined;
    });
    it('should push to a new Page without data', async () => {
        nav.setDomMock(dom);
        await nav.push('app-profile');
        expect(nav.getPageMock()).toEqual('app-profile');
    });
    it('should push to a new Page with data', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-profile');
        await dom.body.appendChild(element);
        await nav.push('app-profile',{name:'stencil'});
        expect(element.name).toEqual('stencil');
        expect(nav.getPageMock()).toEqual('app-profile');
        expect(nav.getDataMock()).toEqual({name:'stencil'});
    });
    it('should create a ViewController when pushing to a new Page with data', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-profile');
        await dom.body.appendChild(element);
        await nav.push('app-profile',{'name':'stencil'});
        expect(nav.getPageMock()).toEqual('app-profile');
        expect(nav.getDataMock()).toEqual({'name':'stencil'});
        expect(nav.getActive().data['name']).toEqual('stencil');
    });
    it('should set the Nav Root', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-profile');
        await dom.body.appendChild(element);
        await nav.setRoot('app-profile',{name:'stencil'});
        let pages: Array<any> = nav.getPagesMock();
        let views: Array<any> = nav.getViewsMock();
        expect(nav.getPageMock()).toEqual('app-profile');
        expect(nav.getDataMock()).toEqual({name:'stencil'});
        expect(pages.length).toEqual(1);
        expect(views.length).toEqual(1);
        expect(pages[0].key).toEqual('app-profile');
        expect(pages[0].value.page).toEqual('app-profile');
        expect(pages[0].value.data).toEqual({name:'stencil'});       
    });
    it('should push to a page after settting a Nav Root', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
        element = mockElement('app-news-item');
        await dom.body.appendChild(element);
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let pages: Array<any> = nav.getPagesMock();
        let views: Array<any> = nav.getViewsMock();
        expect(nav.getPageMock()).toEqual('app-news-item');
        expect(nav.getDataMock()).toEqual({itemObj:{title:'Hello World!',author:'jeep'}});
        expect(pages.length).toEqual(2);
        expect(views.length).toEqual(2);
        expect(pages[0].key).toEqual('app-news-display');
        expect(pages[0].value.page).toEqual('app-news-display');
        expect(pages[0].value.data).toEqual({name:'stencil'});     
        expect(pages[1].key).toEqual('app-news-item');
        expect(pages[1].value.page).toEqual('app-news-item');
        expect(pages[1].value.data).toEqual({itemObj:{title:'Hello World!',author:'jeep'}});     
    });
    it('should pop to a pushed page after settting a Nav Root', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
        element = mockElement('app-news-item');
        await dom.body.appendChild(element);
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let pages: Array<any> = nav.getPagesMock();
        let views: Array<any> = nav.getViewsMock();
        expect(pages.length).toEqual(2);
        expect(views.length).toEqual(2);
        await nav.pop();
        pages = nav.getPagesMock();
        views = nav.getViewsMock();
        expect(pages.length).toEqual(1);     
        expect(views.length).toEqual(1);     
        expect(pages[0].key).toEqual('app-news-display');
        expect(pages[0].value.page).toEqual('app-news-display');
        expect(pages[0].value.data).toEqual({name:'stencil'});     
    });
    it('should set a new Root after having pushed a page after settting a Nav Root', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
        element = mockElement('app-news-item');
        await dom.body.appendChild(element);
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let pages: Array<any> = nav.getPagesMock();
        let views: Array<any> = nav.getViewsMock();
        expect(pages.length).toEqual(2);
        expect(views.length).toEqual(2);
        await nav.setRoot('app-news-create');;
        pages = nav.getPagesMock();
        views = nav.getViewsMock();
        expect(pages.length).toEqual(1);     
        expect(views.length).toEqual(1);     
        expect(pages[0].key).toEqual('app-news-create');
        expect(pages[0].value.page).toEqual('app-news-create');
        expect(pages[0].value.data).toBeNull();     
    });
    it('should return index 1 when a previous page exist', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
        element = mockElement('app-news-item');
        await dom.body.appendChild(element);
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let res: any =  nav.getPrevious(); 
        expect(res.key).toEqual('app-news-display');       
    });
    it('should return undefined when a previous page does not exist', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
        await nav.setRoot('app-news-display',{name:'stencil'});
        let res: any =  nav.getPrevious();        
        expect(res).toBeUndefined();       
    });
    it('should return true when canGoBack as a previous page exist', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
        element = mockElement('app-news-item');
        await dom.body.appendChild(element);
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let res: any =  nav.canGoBack(); 
        expect(res).toBeTruthy();       
    });
    it('should return false when canGoBack as a previous page does not exist', async () => {
        nav.setDomMock(dom);
        let element:any = mockElement('app-news-display');
        await dom.body.appendChild(element);
         await nav.setRoot('app-news-display',{name:'stencil'});
        let res: any =  nav.canGoBack(); 
        expect(res).toBeFalsy();       
    });
});