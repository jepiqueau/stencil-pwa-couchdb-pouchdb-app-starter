//import '@ionic/core';
//import '@stencil/core';
import { Component, Prop, Listen } from '@stencil/core';

@Component({
  tag: 'app-main',
  styleUrl: 'app-main.scss'
})
export class AppMain {
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  componentDidLoad() {

    /*
      Handle service worker updates correctly.
      This code will show a toast letting the
      user of the PWA know that there is a 
      new version available. When they click the
      reload button it then reloads the page 
      so that the new service worker can take over
      and serve the fresh content
    */
    window.addEventListener('swUpdate', () => {
      this.toastCtrl.create({
        message: 'New version available',
        showCloseButton: true,
        closeButtonText: 'Reload'
      }).then((toast) => {
        toast.present();
      });
    })
  }

// had to be commented as ToastController is used in others web components to lauch the error messages
// this problem has been reported to the Stencil team
/*
  @Listen('body:ionToastWillDismiss')
  reload() {
      window.location.reload();
  }
*/
  @Listen('window:swUpdate')
  async onSWUpdate() {
    const toast = await this.toastCtrl.create({
      message: 'New version available',
      showCloseButton: true,
      closeButtonText: 'Reload'
    });
    await toast.present();
    await toast.onWillDismiss()
    window.location.reload();
  }


  // rendering
  render() {
    return (
      <ion-app>
        <ion-router>
          <ion-route url="/" component="app-page"></ion-route>
          <ion-route url="/login" component="app-login"></ion-route>
          <ion-route url="/register"component="app-register"></ion-route>
          <ion-route url="/home/:mode"component="app-home"></ion-route>
          <ion-route url="/news/create" component="app-news-create"></ion-route>
          <ion-route url="/news/create/attachments:multiple" component="app-files-selection"></ion-route>
          <ion-route url="/news/display" component="app-news-display"></ion-route>  
          <ion-route url="/news/display/item/:itemObj" component="app-news-item"></ion-route>  
          <ion-route url="/profile/:name" component="app-profile"></ion-route>
        </ion-router>
        <ion-nav id="navId" root="app-page"></ion-nav> 
        <app-menu></app-menu>
        <ion-popover-controller></ion-popover-controller>           
        <app-error></app-error>
        <app-pouchdb></app-pouchdb>
        <app-session></app-session>
        <app-auth></app-auth>
        <app-connection></app-connection>
      </ion-app>
    );
  }
}
/*

*/