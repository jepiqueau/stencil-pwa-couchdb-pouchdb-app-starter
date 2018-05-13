import { Component, Prop, Element, Method } from '@stencil/core';
import { showToast} from '../../helpers/ui-utilities';

@Component({
  tag: 'app-error',
  styleUrl: 'app-error.scss'
})
export class AppError {
    @Element() el: Element;
    @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;
    @Method()
    initController(toastCtrl:any) {
      this._initController(toastCtrl);
    }
    @Method()
    showError(message:string) {
      return this._showError(message);
    }
    // private methods
    
    _initController(toastCtrl:any) {
        this.toastCtrl = toastCtrl;
    } 
    async _showError(message:string){
        return await showToast(this.toastCtrl,message);
    }

    // rendering
    render() {
        return (
          <slot />
        );
    }
}
