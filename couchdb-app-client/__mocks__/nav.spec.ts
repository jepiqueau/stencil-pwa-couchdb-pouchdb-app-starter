import NavMock from './nav';


describe('nav', () => {
    let nav: any;
    beforeEach(() => {
        nav = new NavMock();        
    });
    afterEach(() => {
        nav.restoreMock();
        nav.resetMock();
        nav = null;        
    });
    it('should create a Nav from mock', () => {
        expect(nav).toBeDefined;
    });
    it('should push to a new Page without data', async () => {
        await nav.push('app-profile');
        expect(nav.getPageMock()).toEqual('app-profile');
    });
    it('should push to a new Page with data', async () => {
        await nav.push('app-profile',{name:'stencil'});
        expect(nav.getPageMock()).toEqual('app-profile');
        expect(nav.getDataMock()).toEqual({name:'stencil'});
    });
    it('should create a ViewController when pushing to a new Page with data', async () => {
        await nav.push('app-profile',{'name':'stencil'});
        expect(nav.getPageMock()).toEqual('app-profile');
        expect(nav.getDataMock()).toEqual({'name':'stencil'});
        expect(nav.getActive().data['name']).toEqual('stencil');
    });
    it('should set the Nav Root', async () => {
        await nav.setRoot('app-profile',{name:'stencil'});
        let pages: Array<any> = nav.getPagesMock();
        expect(nav.getPageMock()).toEqual('app-profile');
        expect(nav.getDataMock()).toEqual({name:'stencil'});
        expect(pages.length).toEqual(1);
        expect(pages[0].key).toEqual('app-profile');
        expect(pages[0].value.page).toEqual('app-profile');
        expect(pages[0].value.data).toEqual({name:'stencil'});       
    });
    it('should push to a page after settting a Nav Root', async () => {
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let pages: Array<any> = nav.getPagesMock();
        expect(nav.getPageMock()).toEqual('app-news-item');
        expect(nav.getDataMock()).toEqual({itemObj:{title:'Hello World!',author:'jeep'}});
        expect(pages.length).toEqual(2);
        expect(pages[0].key).toEqual('app-news-display');
        expect(pages[0].value.page).toEqual('app-news-display');
        expect(pages[0].value.data).toEqual({name:'stencil'});     
        expect(pages[1].key).toEqual('app-news-item');
        expect(pages[1].value.page).toEqual('app-news-item');
        expect(pages[1].value.data).toEqual({itemObj:{title:'Hello World!',author:'jeep'}});     
    });
    it('should pop to a pushed page after settting a Nav Root', async () => {
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let pages: Array<any> = nav.getPagesMock();
        expect(pages.length).toEqual(2);
        await nav.pop();
        pages = nav.getPagesMock();
        expect(pages.length).toEqual(1);     
        expect(pages[0].key).toEqual('app-news-display');
        expect(pages[0].value.page).toEqual('app-news-display');
        expect(pages[0].value.data).toEqual({name:'stencil'});     
    });
    it('should set a new Root after having pushed a page after settting a Nav Root', async () => {
        await nav.setRoot('app-news-display',{name:'stencil'});
        await nav.push('app-news-item',{itemObj:{title:'Hello World!',author:'jeep'}});
        let pages: Array<any> = nav.getPagesMock();
        expect(pages.length).toEqual(2);
        await nav.setRoot('app-news-create');;
        pages = nav.getPagesMock();
        expect(pages.length).toEqual(1);     
        expect(pages[0].key).toEqual('app-news-create');
        expect(pages[0].value.page).toEqual('app-news-create');
        expect(pages[0].value.data).toBeNull();     
    });
    
});