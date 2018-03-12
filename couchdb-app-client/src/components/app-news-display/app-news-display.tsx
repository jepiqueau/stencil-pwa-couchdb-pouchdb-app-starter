import { Component, Method, State, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { LoadingController } from '@ionic/core';
import { initializeComponents, checkServersConnected, initializeMocks } from '../../helpers/ui-utilities';
import { News } from '../../global/interfaces';

@Component({
  tag: 'app-news-display',
  styleUrl: 'app-news-display.scss'
})
export class AppNewsDisplay {

  @State() news: Array<News>;
  @Prop() history: RouterHistory;
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;

  @Method()
  initMocks(mocks:any): Promise<void> {
      // used for unit testing only
      this._pageNews = 'news-display';
      this._history = mocks.history;
      this._loadingCtrl = mocks.loadingCtrl;
      this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                      errorCtrl:true, connectionProvider:true} 
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
      return checkServersConnected(this._history,this._loadingCtrl,this._comps,'news-display','Authenticating ...');
  }
  @Method()
  handleClick(url:string) { 
    this._handleClick(url); 
  }
  private _comps:any;
  private _history: RouterHistory | any;
  private _loadingCtrl : LoadingController | any;
  private _pageNews:string;
 
  componentWillLoad() {
    this._pageNews = 'news-display';
    this._history = this.history;
    this._loadingCtrl = this.loadingCtrl;
    this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                    errorCtrl:true, connectionProvider:true} 
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
  _handleClick(url:string) {
    this._history.push(url, {});
  }

  // rendering
  render() {
    if(this.news) {
      this._pageNews += '/'+this._comps.connectionProvider.getConnection();
      const newsList = this.news.map((news) => {
        let params:News = {
          _id : news._id,
          title: news.title,
          author: news.author,
          dateCreated: news.dateCreated
        }
        const url:string ='/news/display/item/'+JSON.stringify(params);
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
              <ion-button id='button' fill='clear' class="item-button" onClick={() => this.handleClick(url)} ion-button  icon-only>
                <ion-icon class='icon' name="more" color='dark'></ion-icon>
              </ion-button>
            </ion-card-content>
          </ion-card>
        )
      });
      return (
        <ion-page>
          <app-header menu></app-header>
          <app-menu page={this._pageNews}></app-menu>
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
          <app-menu page={this._pageNews}></app-menu>
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
