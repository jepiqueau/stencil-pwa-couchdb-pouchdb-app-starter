import { Component, Prop, Method, State } from '@stencil/core';
import { initializeComponents, initializeMocks } from '../../helpers/ui-utilities';
import { getFromDateISOStringToEnglish } from '../../helpers/utils'; 
import { MatchResults } from '@stencil/router';
import { News } from '../../global/interfaces';

@Component({
    tag: 'app-news-item',
    styleUrl: 'app-news-item.scss'
})
export class AppNewsItem {

    @Prop() match: MatchResults;
    @State() item: News = null;
    @State() attachments: Array<any> = [];
    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._match = mocks.match;
        this._comps = {pouchDBProvider:true,errorCtrl:true} 
        return initializeMocks(this._comps,mocks);
    }
    @Method()
    getItem(): Promise<void> {
        return this._getItem();
    }
    private _comps:any;
    private _englishDate:string;
    private _match: MatchResults | any;
 
    componentWillLoad() {
        this._match = this.match;
        this._comps = {pouchDBProvider:true,errorCtrl:true} 
        initializeComponents(this._comps).then(async () => {
            if(this._comps.pouchDBProvider != null) {
                await this.getItem();
            }
        });
    }
    async _getItem(): Promise<void> {
        if (this._match && this._match.params.itemObj) {
            this.item = JSON.parse(this._match.params.itemObj)
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
                    <app-header></app-header>
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