import { Component, Prop, Element, Method } from '@stencil/core';
import { checkServersConnected, initializeComponents, initializeMocks } from '../../helpers/ui-utilities';


@Component({
  tag: 'app-page',
  styleUrl: 'app-page.scss'
})
export class AppPage {

    private _loadingCtrl : HTMLIonLoadingControllerElement | any;
    private _comps: any

    @Element() el: HTMLElement;
    @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: HTMLIonLoadingControllerElement;

    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._loadingCtrl = mocks.loadingCtrl;
        this._comps = { authProvider:true,sessionProvider:true,errorCtrl:true,
                        connectionProvider:true,navCmpt:true} ;
        return initializeMocks(this._comps,mocks);
    }
    @Method()
    isServersConnected(): Promise<void> {
        return checkServersConnected(this._loadingCtrl,this._comps,'page','Connecting ...');
    }
    componentWillLoad() {
        this._loadingCtrl = this.loadingCtrl;
        this._comps = { authProvider:true,sessionProvider:true,errorCtrl:true,
                        connectionProvider:true,navCmpt:true} 
        initializeComponents(this._comps).then(async () => {
            if(this._comps.authProvider != null && this._comps.sessionProvider != null) {
                await this.isServersConnected()          
            }                        
        });
    
    }

    // rendering
    render() {
        return (
            <ion-page class='show-page'>
                <app-header></app-header>
                <ion-content>
                    <app-logo width="75%"></app-logo>
                    <div class="text">
                        <h2>Welcome to the Jeep PouchDB Application Starter</h2>
                    </div>
                </ion-content>
            </ion-page>
        );
    }
}