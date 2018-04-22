import { Component, Element, Method } from '@stencil/core';
import { initializeComponents, initializeMocks} from '../../helpers/ui-utilities';
import { PopOptions } from '../../global/interfaces';

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss'
})
export class AppMenu {

    @Element() el: HTMLElement;

    private _popCmp:string;
    private _popEvent: any;
    private _popData: any;
    private _conMode: string ='offline';
    private _comps: any;
    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._comps = { popoverCtrl:true,connectionProvider:true,menuCtrl:true,
                        navCmpt:true} ;
        return initializeMocks(this._comps,mocks);
    }
/*
    @Method()
    handleClick(item:string) {
        this._handleClick(item);
    }
*/
    async componentDidLoad() {
        this._comps = { popoverCtrl:true,connectionProvider:true,menuCtrl:true,
            navCmpt:true} ;
        await initializeComponents(this._comps);
    }
    async presentPopover(options:PopOptions): Promise<void> {          
        this._popCmp = options.component ? options.component : null;
        this._popEvent = options.ev ? options.ev : null;
        this._popData = options.componentProps ? options.componentProps : null;

        const popoverElement = await this._comps.popoverCtrl.create({
            component: this._popCmp,
            ev: this._popEvent,
            componentProps:this._popData
        });
        return popoverElement.present();
    }
    _handleClickEvent(event) {
        this._handleClick(event.target.textContent);
    }
    async _handleClick(item:string,event?:UIEvent) {
        this._comps.menuCtrl.toggle('menu');
        switch (item) {
            case "Home" : {
                if(this._comps.connectionProvider != null ) {
                    this._conMode = await this._comps.connectionProvider.getConnection();
                }                          
                this._comps.navCmpt.setRoot('app-home',{mode:this._conMode});
                break;
            }
            case "Profile" : {
                this._comps.navCmpt.push('app-profile',{name:'stencil'});
                break;
            }
            case "News": {
                await this.presentPopover({
                    component:'app-popover',
                    ev:event,
                    componentProps:{data:[
                        {cmp:'app-news-create',value:'News Create'},
                        {cmp:'app-news-display',value:'News Display'}
                    ]}
                });
                break;
            }
            default: {
                console.log('default')
            }            
        }
    } 
    // rendering
    render() {
        return (
            <main>        
                <ion-menu menuId="menu" contentId="navId">
                    <ion-header>
                        <ion-toolbar>
                            <ion-title>Menu</ion-title>
                        </ion-toolbar>
                    </ion-header>
                    <ion-content>
                        <ion-list id="menu-items">
                            <ion-item onClick={this._handleClickEvent.bind(this)}>
                                <ion-label>Home</ion-label>
                            </ion-item>
                            <ion-item onClick={this._handleClickEvent.bind(this)}>
                                <ion-label>Profile</ion-label>
                            </ion-item>
                            <ion-item onClick={this._handleClickEvent.bind(this)}>
                                <ion-label>News</ion-label>
                            </ion-item>
                        </ion-list>
                    </ion-content>
                </ion-menu> 
            </main>

        )
    }   
}
