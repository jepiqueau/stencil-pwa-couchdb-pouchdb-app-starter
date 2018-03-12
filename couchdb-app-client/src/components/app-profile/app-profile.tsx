import { Component, Listen, Prop, State, Method } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import { RouterHistory } from '@stencil/router';
import { LoadingController } from '@ionic/core';
import { ToastController } from '@ionic/core';
import { initializeComponents, initializeMocks, checkServersConnected } from '../../helpers/ui-utilities';

import { urlB64ToUint8Array } from '../../helpers/utils';


@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.scss'
})
export class AppProfile {
  private _comps:any;
  private _history: RouterHistory | any;
  private _loadingCtrl : LoadingController | any;
  private _pageNews: string;

  @Prop() match: MatchResults;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop() history: RouterHistory;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;

  @State() isRender: boolean;
  @State() notify: boolean;
  @State() swSupport: boolean;
  @Method()
  initMocks(mocks:any): Promise<void> {
      // used for unit testing only
      this._pageNews = 'profile';
      this.isRender = true;
      this._history = mocks.history;
      this._loadingCtrl = mocks.loadingCtrl;
      this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                      errorCtrl:true,connectionProvider:true} 
      return initializeMocks(this._comps,mocks);
  }
  @Method()
  isServersConnected(): Promise<void> {
      return checkServersConnected(this._history,this._loadingCtrl,this._comps,'profile','Authenticating ...');
  }

  // demo key from https://web-push-codelab.glitch.me/
  // replace with your key in production
  publicServerKey = urlB64ToUint8Array('BBsb4au59pTKF4IKi-aJkEAGPXxtzs-lbtL58QxolsT2T-3dVQIXTUCCE1TSY8hyUvXLhJFEUmH7b5SJfSTcT-E');

  componentWillLoad() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.swSupport = true;
    } else {
      this.swSupport = false;
    }
    this.isRender = false;
    this._pageNews = 'news-create';
    this._history = this.history;
    this._loadingCtrl = this.loadingCtrl;
    this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                    errorCtrl:true,connectionProvider:true} 
    initializeComponents(this._comps).then(async () => {
        if(this._comps.authProvider != null && this._comps.sessionProvider != null) {
            this.isServersConnected().then (()=> {
              this.isRender = true;         
            })         
          }                        
    });
  }

  @Listen('ionChange')
  subscribeToNotify($event) {
    console.log($event.detail.checked);

    if ($event.detail.checked === true) {
      this.handleSub();
    }
  }

  handleSub() {
    // get our service worker registration
    navigator.serviceWorker.getRegistration().then((reg: ServiceWorkerRegistration) => {

      // get push subscription
      reg.pushManager.getSubscription().then((sub: PushSubscription) => {

        // if there is no subscription that means
        // the user has not subscribed before
        if (sub === null) {
          // user is not subscribed
          reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.publicServerKey
          })
            .then((sub: PushSubscription) => {
              // our user is now subscribed
              // lets reflect this in our UI
              console.log('web push subscription: ', sub);

              this.notify = true;
            })
        }
      })
    })
  }

  // rendering
  render() {
    if(this.isRender) {
      this._pageNews += '/'+this._comps.connectionProvider.getConnection();
    }
    if (this.match && this.match.params.name) {
      return (
        <ion-page>
          <app-header menu htitle='Ionic PWA Toolkit'></app-header>
          <app-menu page={this._pageNews}></app-menu>

          <ion-content>
            <p>
              Hello! My name is {this.match.params.name}.
              My name was passed in through a route param!
            </p>

            {this.swSupport ? <ion-item>
              <ion-label>Notifications</ion-label>
              <ion-toggle checked={this.notify} disabled={this.notify}></ion-toggle>
            </ion-item> : null}
          </ion-content>
        </ion-page>
      );
    }
  }
}
