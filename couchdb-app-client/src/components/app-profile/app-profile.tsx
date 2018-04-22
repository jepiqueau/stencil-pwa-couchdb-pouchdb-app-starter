import { Component, Element, Listen, Prop, State, Method } from '@stencil/core';
import { LoadingController } from '@ionic/core';
import { ToastController } from '@ionic/core';
import { initializeComponents, initializeMocks, checkServersConnected } from '../../helpers/ui-utilities';
//import { NavParams } from '@ionic/core/dist/types/components/nav/nav-util';

import { urlB64ToUint8Array } from '../../helpers/utils';


@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.scss'
})
export class AppProfile {
  private _comps:any;
  private _loadingCtrl : LoadingController | any;
  @Element() el:Element;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;
  @Prop() name: string;
  @State() notify: boolean;
  @State() swSupport: boolean;
  @State() isRender:boolean = false;
  @Method()
  initMocks(mocks:any): Promise<void> {
      // used for unit testing only
      this._loadingCtrl = mocks.loadingCtrl;
      this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                      errorCtrl:true,connectionProvider:true,navCmpt:true} 
        this.isRender = true;
        return initializeMocks(this._comps,mocks);
  }
  @Method()
  isServersConnected(): Promise<void> {
      return checkServersConnected(this._loadingCtrl,this._comps,'profile','Authenticating ...');
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
    this._loadingCtrl = this.loadingCtrl;
    this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                    errorCtrl:true,connectionProvider:true,navCmpt:true} 
    initializeComponents(this._comps).then( () => {
      if(this._comps.authProvider != null && this._comps.sessionProvider != null) {
        this.isServersConnected().then (()=> {
        })         
      }                        
      });
  }
  componentDidLoad() {
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
  if(this.name) {
      return (
        <ion-page>
          <app-header menu htitle='Ionic PWA Toolkit'></app-header>
          <ion-content>
            <p>
              Hello! My name is {this.name}.
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
