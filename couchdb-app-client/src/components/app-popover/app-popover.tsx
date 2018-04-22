import { Component, Element, Method, State, Prop, Event, EventEmitter} from '@stencil/core';
import { ComponentRef, ComponentProps } from '@ionic/core';
import { initializeComponents, initializeMocks } from '../../helpers/ui-utilities';


@Component({
  tag: 'app-popover',
  styleUrl: 'app-popover.scss'
})
export class AppPopover {
  @Element() el: HTMLElement;
  @Prop() component: ComponentRef;
  @Prop() componentProps: ComponentProps;
  @Prop() ev: any;
  @State() data: Array<any> = [];
  @Event() itemClick : EventEmitter;

  private _comps:any;
  private _popover: HTMLIonPopoverElement;

  @Method()
  initMocks(mocks:any): Promise<void> {
    // used for unit testing only
    this._comps = {navCmpt:true,popoverCtrl:true};
    return initializeMocks(this._comps,mocks);
  }
  @Method()
  setData (): Promise<void> { 
    // used for unit testing only
    return this._setData();  
  }
  @Method()
  handleClick(item:string) {
    this._handleClick(item);
  }
  componentWillLoad() {
    this._comps = {navCmpt:true,popoverCtrl:true};
    initializeComponents(this._comps).then(async ()=> {
      await this._setData();
    });
  }
  _setData():Promise<void> {
    if(this._comps.popoverCtrl != null ) {
      this._popover = this._comps.popoverCtrl.getTop();
      if(this._popover.componentProps && this._popover.componentProps.data ) {
        this.data = this._popover.componentProps.data;
      }
    }
    return Promise.resolve();
  }

  _handleClickEvent(event) {
    this._handleClick(event.target.textContent);
  }
  async _handleClick(text:string) {
    let selObj: any = this.data.find(s => s.value === text);
    await this._comps.popoverCtrl.dismiss();
    await this._comps.navCmpt.push(selObj.cmp);
    this.itemClick.emit();
  }
  render() {
    if(this.data.length > 0) {
      const listTitle: string = this.data[0].value.split(' ')[0];
      const list = this.data.map((item) => {
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
