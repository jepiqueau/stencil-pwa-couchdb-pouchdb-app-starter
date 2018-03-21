import { Component, Method, State } from '@stencil/core';
import { initializeComponents, initializeMocks } from '../../helpers/ui-utilities';
import { getFromDateISOStringToEnglish } from '../../helpers/utils'; 
import { News } from '../../global/interfaces';
import { NavParams } from '@ionic/core/dist/types/components/nav/nav-util';

@Component({
    tag: 'app-news-item',
    styleUrl: 'app-news-item.scss'
})
export class AppNewsItem {

    @State() item: News = null;
    @State() attachments: Array<any> = [];
    @State() navData: NavParams;
    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._comps = {pouchDBProvider:true,errorCtrl:true,navCmpt:true} 
        return initializeMocks(this._comps,mocks);
    }
    @Method()
    getNavData(): Promise<void> {
      return this._getNavData();
    }
  
    private _comps:any;
    private _englishDate:string;
 
    componentWillLoad() {
        this._comps = {pouchDBProvider:true,errorCtrl:true,navCmpt:true} 
        initializeComponents(this._comps).then(async () => {
            if(this._comps.pouchDBProvider != null) {
                await this.getNavData();
            }
        });
    }
    async _getNavData() : Promise<void>{
        if(this._comps.navCmpt != null) {
            if(this._comps.navCmpt.getActive() != null) {
                this.navData = this._comps.navCmpt.getActive().data;
                await this._getItem();
            } else {
                this.navData = null;
            }
        }
        return Promise.resolve();
    }
    
    async _getItem(): Promise<void> {
        if (this.navData && this.navData['itemObj']) {
            this.item = this.navData['itemObj'];
            this._englishDate = getFromDateISOStringToEnglish(this.item.dateCreated)
            // get the news attachment
            let result = await this._comps.pouchDBProvider.getTextAttachments(this.item._id,'content');
            if(result !== null && result.ok) {
                this.attachments.push(result.text);
            } else {
                await this._comps.errorCtrl.showError("No Attachments for this News document");
            }
        }
        return Promise.resolve();
    }
    // rendering
    render() {
        if (this.item) {    
            return (
                <ion-page>
                    <app-header back></app-header>
                    <ion-content>
                        <ion-card id='news-item-card'>
                            <ion-card-header> 
                                <ion-card-title>
                                    {this.item.title}
                                </ion-card-title>
                                <ion-card-subtitle class='subtitle'>
                                    <br />
                                    <slot>{this._englishDate} / <span>{this.item.author}</span></slot>
                                </ion-card-subtitle>
                            </ion-card-header>
                            <ion-card-content>
                                {this.attachments.length > 0 ?
                                    <ion-items class='content'>
                                        {this.attachments[0]}
                                    </ion-items>
                                : null }
                            </ion-card-content>
                        </ion-card>
                    </ion-content>
                </ion-page>          
            );
        } else {
            return (
                <ion-page>
                    <app-header></app-header>
                    <ion-content>
                    <ion-list>
                        <div id='fake-card'></div>
                    </ion-list>
                    </ion-content>
                </ion-page>
            )
        }
    }
}