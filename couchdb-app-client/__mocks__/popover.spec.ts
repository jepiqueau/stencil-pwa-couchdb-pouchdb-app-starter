import PopoverMock from './popover';


describe('popover', () => {
    let popover: any;
    beforeEach(() => {
        popover = new PopoverMock();        
    });
    afterEach(() => {
        popover.restoreMock();
        popover.resetMock();
        popover = null;        
    });
    it('should create a Popover from mock', () => {
        expect(popover).toBeDefined;
    });
    it('should set the popover component', async () => {
        let options:any ={component:'app-news-popover'}
        await popover.setDataMock(options);
        expect(popover.getDataMock().component).toEqual('app-news-popover');
        expect(popover.getDataMock().data).toBeNull;
        expect(popover.getDataMock().ev).toBeNull;
    });
    it('should set the popover component & data', async () => {
        let options:any ={  component:'app-news-popover',
                            data:{data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]}};
        await popover.setDataMock(options);
        expect(popover.getDataMock().component).toEqual('app-news-popover');
        expect(popover.getDataMock().data).toEqual({data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]});
        expect(popover.getDataMock().ev).toBeNull;
    });
    it('should set the popover component & data', async () => {
        const event = { preventDefault: () => {} };
        let options:any ={  component:'app-news-popover',
                            data:{data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]},
                            ev:event};
        await popover.setDataMock(options);
        expect(popover.getDataMock().component).toEqual('app-news-popover');
        expect(popover.getDataMock().data).toEqual({data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]});
        expect(JSON.stringify(popover.getDataMock().ev)).toEqual(JSON.stringify({ preventDefault: () => {} }));
    });
    it('should present the popover', async () => {
        let options:any ={component:'app-news-popover'}
        await popover.setDataMock(options);
        popover.present(() => {
            expect(popover.getDataMock().component).toEqual('app-news-popover');
        });
    });
    it('should dismiss the popover', async () => {
        let options:any ={component:'app-news-popover'}
        await popover.setDataMock(options);
        popover.dismiss(() => {
            expect(popover.getDataMock().component).toBeNull;            
            expect(popover.getDataMock().data).toBeNull;
            expect(popover.getDataMock().ev).toBeNull;
        });
    });
    
});