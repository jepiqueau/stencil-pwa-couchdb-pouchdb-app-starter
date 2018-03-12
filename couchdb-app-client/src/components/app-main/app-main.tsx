import { Component, Prop, /*Listen*/ } from '@stencil/core';
import { ToastController } from '@ionic/core';

@Component({
  tag: 'app-main',
  styleUrl: 'app-main.scss'
})
export class AppMain {
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;

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

  // rendering
  render() {
    return (
      <ion-app>
        <main>
          <stencil-router>
            <stencil-route url='/' component='app-page' exact={true}>
            </stencil-route>
            <stencil-route url='/login' component='app-login'>
            </stencil-route>
            <stencil-route url='/register' component='app-register'>
            </stencil-route>
            <stencil-route url='/home/:conmode' component='app-home'>
            </stencil-route>
            <stencil-route url='/news/create' component='app-news-create'>
            </stencil-route>
            <stencil-route url='/news/display' component='app-news-display'>
            </stencil-route>
            <stencil-route url='/news/display/item/:itemObj' component='app-news-item'>
            </stencil-route>
            <stencil-route url='/profile/:name' component='app-profile'>
            </stencil-route>
          </stencil-router>
          <app-error></app-error>
          <app-pouchdb></app-pouchdb>
          <app-session></app-session>
          <app-auth></app-auth>
          <app-connection></app-connection>
        </main>
      </ion-app>
    );
  }
}
