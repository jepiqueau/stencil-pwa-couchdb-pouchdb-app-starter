import { Component, Prop, Element, Method } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { LoadingController } from '@ionic/core';
import { checkServersConnected, initializeComponents, initializeMocks } from '../../helpers/ui-utilities';


@Component({
  tag: 'app-page',
  styleUrl: 'app-page.scss'
})
export class AppPage {

    private _history: RouterHistory | any;
    private _loadingCtrl : LoadingController | any;
    private _comps: any

    @Element() el: HTMLElement;
    @Prop() history: RouterHistory;
    @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;

    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._history = mocks.history;
        this._loadingCtrl = mocks.loadingCtrl;
        this._comps = {authProvider:true,sessionProvider:true,errorCtrl:true,connectionProvider:true} 
        return initializeMocks(this._comps,mocks);
    }
    @Method()
    isServersConnected(): Promise<void> {
        return checkServersConnected(this._history,this._loadingCtrl,this._comps,'page','Connecting ...');
    }
    componentWillLoad() {
        this._history = this.history;
        this._loadingCtrl = this.loadingCtrl;
        this._comps = {authProvider:true,sessionProvider:true,errorCtrl:true,connectionProvider:true} 
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