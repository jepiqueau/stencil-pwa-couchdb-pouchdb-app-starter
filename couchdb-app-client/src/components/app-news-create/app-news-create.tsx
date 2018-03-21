import { Component, Element, State, Prop, Method } from '@stencil/core';
import { LoadingController } from '@ionic/core';
import { nFirstWords, getDateISOString } from '../../helpers/utils';
import { initializeComponents, initializeMocks, checkServersConnected } from '../../helpers/ui-utilities';
import { News } from '../../global/interfaces';
import { ELLIPSIS_NUMBER_WORDS } from '../../global/constants';
@Component({
  tag: 'app-news-create',
  styleUrl: 'app-news-create.scss'
})
export class AppNewsCreate {

  @Element() el: HTMLElement;
  @State() title: string = '';
  @State() content: string = '';
  @State() author: string = '';
  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;

  @Method()
  initMocks(mocks:any): Promise<void> {
      // used for unit testing only
      this._loadingCtrl = mocks.loadingCtrl;
      this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                      errorCtrl:true,connectionProvider:true,navCmpt:true} 
      return initializeMocks(this._comps,mocks);
  }
  @Method()
  isServersConnected(): Promise<void> {
      return checkServersConnected(this._loadingCtrl,this._comps,'news-create','Authenticating ...');
  }
  @Method()
  handleSubmit(): Promise<void> {
    return this._handleSubmit();
  }
  @Method()
  handleChangeNewsTitle(title:string): Promise<void> {
    return this._handleChangeNewsTitle(title);
  }
  @Method()
  handleChangeNewsAuthor(author:string): Promise<void> {
    return this._handleChangeNewsAuthor(author);
  } 
  @Method()
  handleChangeNewsContent(content:string): Promise<void> {
    return this._handleChangeNewsContent(content);
  }

  private _title: HTMLElement;
  private _author: HTMLElement;
  private _content: HTMLElement;
  private _button: HTMLElement;
  private _comps:any;
  private _loadingCtrl : LoadingController | any;


  componentWillLoad() {
    this._loadingCtrl = this.loadingCtrl;
    this._comps = { authProvider:true,sessionProvider:true,pouchDBProvider:true,
                    errorCtrl:true,connectionProvider:true,navCmpt:true} 
    initializeComponents(this._comps).then(async () => {
        if(this._comps.authProvider != null && this._comps.sessionProvider != null) {
            this.isServersConnected().then (()=> {
            })         
          }                        
    });
  }
  componentDidLoad() { 
    this._title = this.el.querySelector('.entry.title');
    this._author = this.el.querySelector('.entry.author');
    this._content = this.el.querySelector('.entry.text-content');
    this._button = this.el.querySelector('#button');
  }

  // handling inputs events
  async _handleChange(e,type:string) {
    e.preventDefault();
    switch(type) {
      case 'title' : {
        await this.handleChangeNewsTitle(e.target.value);
        break;
      }
      case 'author' : {
        await this.handleChangeNewsAuthor(e.target.value);
        break;
      }
      case 'content' : {
        await this.handleChangeNewsContent(e.target.value);
        break;
      }
      case 'submit' : {
        await this.handleSubmit();
        break;
      }

    }
  }
  async _handleSubmit(): Promise<void> {
    if(this.title.length > 0 && this.content.length > 0) {
      // create the document
      let docDate: string = getDateISOString(new Date());
      let doc:News = {
        type: "news",
        title: this.title,
        author: this.author,
        ellipsis: nFirstWords(this.content,ELLIPSIS_NUMBER_WORDS),
        display: true,
        dateCreated: docDate,
        dateUpdated: docDate,                  
      }
      // create the doc in pouchdb
      let result: any = await this._comps.pouchDBProvider.createDoc(doc);
      // get the newly created document
      if(result.ok) {
        let retDoc:any = await this._comps.pouchDBProvider.getDoc(result.id);
        // add the text-content as attachment
        let res = await this._comps.pouchDBProvider.addTextAttachments(retDoc.doc,this.content,'content');
        if (res.ok) {
          await this._comps.errorCtrl.showError("The News document has been succesfully created");
        } else {
          await this._comps.errorCtrl.showError("Error: News document created with no Text Attachment");
        }
      } else {
        await this._comps.errorCtrl.showError("Error: No News document created");        
      }
    }
    return Promise.resolve();
  }
  _handleChangeNewsTitle(title:string): Promise<void> {
    if(title.length > 0) {
      this.title = title;
      this._handleButtonVisibility('add');
      this._handleValidated(this._title,'add');
    } else {
        this.title = '';
        this._handleButtonVisibility('remove');
        this._handleValidated(this._title,'remove');
    }
    return Promise.resolve();
  } 
  _handleChangeNewsAuthor(author:string): Promise<void> {
    if(author.length > 0) {
      this.author = author;
      this._handleButtonVisibility('add');
      this._handleValidated(this._author,'add');
    } else {
        this.author = '';
        this._handleButtonVisibility('remove');
        this._handleValidated(this._author,'remove');
    }
    return Promise.resolve();
  } 
  _handleChangeNewsContent(content:string): Promise<void> {
    if(content.length > 0) {
      this.content = content;
      this._handleButtonVisibility('add');
      this._handleValidated(this._content,'add');
    } else {
        this.content = '';
        this._handleButtonVisibility('remove');
        this._handleValidated(this._content,'remove');
    }
    return Promise.resolve();
  }
  _handleValidated(element:HTMLElement,type:string) {
      if(type ==='add') {
        element.classList.add('validated');      
      }
      if(type === 'remove'){
        if(element.classList.contains('validated')) {
          element.classList.remove('validated');
        }
      }
  }
  _handleButtonVisibility(type:string){
      if(type === 'add') {
        if(this.title.length > 0 && this.content.length > 0 && this.author.length > 0) {
          this._button.classList.add('visible');
        }
      }
      if(type === 'remove') {
        if(this._button.classList.contains('visible')) this._button.classList.remove('visible');
      }
  }

  // rendering
  render() {
    return (
      <ion-page>
        <app-header menu></app-header>
        <ion-content>
          <div id='news-create-card' class='card'>
            <div class="form-container">
              <div class="form">
                <form class="news-create-form" onSubmit={(event) => this._handleChange(event,'submit')}>
                  <textarea class="entry title" id="title" rows={2} placeholder="news title"  value={this.title} autofocus onInput={(event) => this._handleChange(event,'title')} />
                  <input class="entry author" id="author" type="text" placeholder="author" value={this.author} onInput={(event) => this._handleChange(event,'author')} />
                  <textarea class="entry text-content" id="content" rows={11} placeholder="news content" value={this.content} onInput={(event) => this._handleChange(event,'content')} />
                  <input class="button" id="button" type="submit" value="Create" />
                </form>
              </div>
            </div>
          </div>
        </ion-content>
      </ion-page>
    );
  }
}

