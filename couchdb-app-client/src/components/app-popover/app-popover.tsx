import { Component, Element, Method, State } from '@stencil/core';
import { initializeComponents, initializeMocks } from '../../helpers/ui-utilities';


@Component({
  tag: 'app-popover',
  styleUrl: 'app-popover.scss'
})
export class AppPopover {
  @Element() el: HTMLIonPopoverElement;
  @State() isRender : boolean = false;
  private _comps:any;

  @Method()
  initMocks(mocks:any): Promise<void> {
    // used for unit testing only
    this._comps = {navCmpt:true,popoverCtrl:true};
    return initializeMocks(this._comps,mocks);
  }
  @Method()
  setData (data: Array<any>): Promise<void> { 
    // used for unit testing only
    this.el.data = data;
    this.isRender = true;
    return Promise.resolve();  
  }
  @Method()
  handleClick(item:string) {
    this._handleClick(item);
  }
  componentWillLoad() {
    this._comps = {navCmpt:true,popoverCtrl:true};
    initializeComponents(this._comps).then(()=> {
    })
  }
  _handleClickEvent(event: UIEvent) {
    this._handleClick(event.srcElement.textContent);
  }
  async _handleClick(text:string) {
    this._comps.popoverCtrl.dismiss();
    let selObj: any = this.el.data.find(s => s.value === text);
    this._comps.navCmpt.setRoot(selObj.cmp);
  }
  render() {
    if(this.el.data) {
      const listTitle: string = this.el.data[0].value.split(' ')[0];
      const list = this.el.data.map((item) => {
        return (
          <ion-item onClick={ (event: UIEvent) => this._handleClickEvent(event)}>
            <ion-label>{item.value}</ion-label>
          </ion-item> 
        )
      });
      return (
          <ion-content>
            <ion-list>
              <ion-list-header color='dark'>{listTitle}</ion-list-header>
              {list}
            </ion-list>
          </ion-content>
      );
    }
  }
}
