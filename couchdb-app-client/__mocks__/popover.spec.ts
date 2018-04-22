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
        popover.component = 'app-news-popover';
        expect(popover.component).toEqual('app-news-popover');
        expect(popover.data).toBeNull;
        expect(popover.ev).toBeNull;  
    });
    it('should set the popover component & data', async () => {
        popover.component = 'app-news-popover';
        popover.componentProps = {data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]};
        expect(popover.component).toEqual('app-news-popover');
        expect(popover.componentProps).toEqual({data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]});
        expect(popover.ev).toBeNull;
    });
    it('should set the popover component & data', async () => {
        const event = { preventDefault: () => {} };
        popover.component = 'app-news-popover';
        popover.componentProps = {data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]};
        popover.ev = event;
        expect(popover.component).toEqual('app-news-popover');
        expect(popover.componentProps).toEqual({data:[{key:1,value:'News Create'},{key:2,value:'News Display'}]});
        expect(JSON.stringify(popover.ev)).toEqual(JSON.stringify({ preventDefault: () => {} }));
    });
    it('should present the popover', async () => {
        popover.component = 'app-news-popover';
        await popover.present();
        expect(popover.component).toEqual('app-news-popover');
    });
    it('should dismiss the popover', async () => {
        popover.component = 'app-news-popover';
        await popover.present();
        await popover.dismiss();
        expect(popover.component).toBeNull;            
        expect(popover.data).toBeNull;
        expect(popover.ev).toBeNull;
    });
});