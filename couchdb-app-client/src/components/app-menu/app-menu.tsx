import { Component, Element, Method } from '@stencil/core';
import { getMenuController, getPopoverController,getNavComponent } from '../../helpers/ui-utilities'
import { PopOptions } from '../../global/interfaces';

@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss'
})
export class AppMenu {

    @Element() el: HTMLElement;

    private _menuCtrl: HTMLIonMenuControllerElement;
    private _nav: HTMLIonNavElement;
    private _popoverCtrl: HTMLIonPopoverControllerElement;
    private _popCmp:string;
    private _popEvent: any;
    private _popData: any;

    @Method()
    handleClick(item:string) {
        this._handleClick(item);
    }
    async componentDidLoad() {
        this._nav = await getNavComponent();
        this._menuCtrl = await getMenuController();
        this._popoverCtrl = await getPopoverController();
    }
    async presentPopover(options:PopOptions) {          
        this._popCmp = options.component ? options.component : null;
        this._popEvent = options.ev ? options.ev : null;
        this._popData = options.data ? options.data : null;
        const popoverElement = await this._popoverCtrl.create({
            component: this._popCmp,
            ev: this._popEvent,
            data:this._popData
        });
        return await popoverElement.present();
    }
    _handleClickEvent(event: UIEvent) {
        this._handleClick(event.srcElement.textContent);
    }
    
    _handleClick(item:string,event?:UIEvent) {
        this._menuCtrl.toggle('menu');

        switch (item) {
            case "Home" : {
                this._nav.setRoot('app-home');
                break;
            }
            case "Profile" : {
                this._nav.setRoot('app-profile',{name:'stencil'});
                break;
            }
            case "News": {
                this.presentPopover({
                    component:'app-popover',
                    ev:event,
                    data:{data:[
                        {cmp:'app-news-create',value:'News Create'},
                        {cmp:'app-news-display',value:'News Display'}
                    ]}
                });

                break;
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
                            <ion-item onClick={ (event: UIEvent) => this._handleClickEvent(event)}>
                                <ion-label>Home</ion-label>
                            </ion-item>
                            <ion-item onClick={ (event: UIEvent) => this._handleClickEvent(event)}>
                                <ion-label>Profile</ion-label>
                            </ion-item>
                            <ion-item onClick={ (event: UIEvent) => this._handleClickEvent(event)}>
                                <ion-label>News</ion-label>
                            </ion-item>
                        </ion-list>
                    </ion-content>
                </ion-menu> 
            </main>

        )
    }   
}
