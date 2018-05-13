import { Component, Element, Method, State, Prop } from '@stencil/core';
import { ComponentProps } from '@ionic/core';
import { initializeComponents, checkServersConnected, initializeMocks } from '../../helpers/ui-utilities';
import { News } from '../../global/interfaces';

@Component({
  tag: 'app-news-display',
  styleUrl: 'app-news-display.scss'
})
export class AppNewsDisplay {
  @Element() el: HTMLElement;
  @State() news: Array<News>;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: HTMLIonLoadingControllerElement;

  @Method()
  initMocks(mocks:any): Promise<void> {
      // used for unit testing only
      this._loadingCtrl = mocks.loadingCtrl;
      this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                      errorCtrl:true, connectionProvider:true,navCmpt:true} 
      return initializeMocks(this._comps,mocks);
  }
  @Method() 
  setNews(news:Array<News>) {
    // used for unit testing only
    this.news = news;
  }
  @Method() 
  getNews() {
    // used for unit testing only
    return this._getNews();
  }
  @Method()
  isServersConnected(): Promise<void> {
      return checkServersConnected(this._loadingCtrl,this._comps,'news-display','Authenticating ...');
  }
  @Method()
  handleClick(params:News) { 
    this._handleClick(params); 
  }
  private _comps:any;
  private _loadingCtrl : HTMLIonLoadingControllerElement | any;
 
  componentWillLoad() {
    this._loadingCtrl = this.loadingCtrl;
    this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                    errorCtrl:true, connectionProvider:true,navCmpt:true} 
    initializeComponents(this._comps).then(async () => {
        if(this._comps.authProvider != null && this._comps.sessionProvider != null 
                                            && this._comps.pouchDBProvider != null) {
            this.isServersConnected().then(async () => {          
              this.news = await this.getNews();
            });
        }
    });
  }
  // private methods
  async _getNews(): Promise<Array<News>> {
    let queryOptions: any = {
      include_docs: true,
      descending: true
    };
    return Promise.resolve(await this._comps.pouchDBProvider.queryDoc('news/display_by_date_created',queryOptions));
  }

  // handling events
  _handleClick(params:News) {
    let data: ComponentProps = {itemObj:params};
    this._comps.navCmpt.push('app-news-item', data);
  }

  // rendering
  render() {
    if(this.news) {
      const newsList = this.news.map((news) => {
        const params:News = {
          _id : news._id,
          title: news.title,
          author: news.author,
          dateCreated: news.dateCreated
        }
        return (
          <ion-card id='news-display-card'>
            <ion-card-header> 
              <ion-card-title>
                {news.title}
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-items id='ellipsis'>
                <p>{news.ellipsis}</p>
              </ion-items>
              <ion-button id='button' fill='clear' class="item-button" onClick={() => this.handleClick(params)} ion-button  icon-only>
                <ion-icon class='icon' name="more" color='dark'></ion-icon>
              </ion-button>
            </ion-card-content>
          </ion-card>
        )
      });
      return (
        <ion-page>
          <app-header menu></app-header>
          <ion-content>
            <ion-list>
              {newsList}
            </ion-list>
          </ion-content>
        </ion-page>
      );
    } else {
      return (
        <ion-page>
          <app-header menu></app-header>
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
