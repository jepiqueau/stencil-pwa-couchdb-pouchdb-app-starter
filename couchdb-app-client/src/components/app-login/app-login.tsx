import { Component, Prop, Element, Method, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { LoadingController } from '@ionic/core';
import { initializeComponents, initializeMocks, presentLoading, dismissLoading } from '../../helpers/ui-utilities';
import { User, Session, Credentials } from '../../global/interfaces'
import { validator } from '../../validators/validators'
import { DEBOUNCE_TIMEOUT, REGEXP_USERNAME, REGEXP_PASSWORD, ERROR_USERNAME, ERROR_PASSWORD } from '../../global/constants';


@Component({
  tag: 'app-login',
  styleUrl: 'app-login.scss'
})
export class AppLogin {
    private _User: User;
    private _Username: HTMLElement;
    private _Password: HTMLElement;
    private _button: HTMLElement;
    private _history: RouterHistory | any;
    private _loadingCtrl: LoadingController | any;
    private _comps: any;

    @Element() el: HTMLElement;
    @State() username: string = '';
    @State() password: string = '';
    @Prop() history: RouterHistory;
    @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;

    @Method()
    isServersConnected(): Promise<void> {
        return this._isServersConnected();
    }
    @Method()
    initMocks(mocks:any): Promise<void> {
        // used for unit testing only
        this._history = mocks.history;
        this._loadingCtrl = mocks.loadingCtrl;
        this._comps = {authProvider:true,sessionProvider:true,errorCtrl:true} 
        return initializeMocks(this._comps,mocks);
    }
    @Method()
    setUser(username:string,password:string){
        // used for unit testing only
      this.username = username;
      this.password = password;        
    }
    @Method()
    handleSubmit(): Promise<void> {
      return this._handleSubmit();
    }
    @Method()
    handleRegister(tag:string): Promise<void> {
      return this._handleRegister(tag);
    }
    @Method()
    handleChangeUsername(username:string): Promise<void> {
      return this._handleChangeUsername(username);
    } 
    @Method()
    handleChangePassword(password:string): Promise<void> {
      return this._handleChangePassword(password);
    }
    componentWillLoad() {
      this._history = this.history;
      this._loadingCtrl = this.loadingCtrl;
      this._comps = {authProvider:true,sessionProvider:true,errorCtrl:true} 
      initializeComponents(this._comps).then(async () => {
          if(this._comps.authProvider != null && this._comps.sessionProvider != null) {
              await this.isServersConnected()          
          }                        
      });
    }
    componentDidLoad() { 
        this._Username = this.el.querySelector('#username');
        this._Password = this.el.querySelector('#password');
        this._button = this.el.querySelector('.form .login-form .button');
    }

    // private methods
    _isServersConnected(): Promise<void> {
      return new Promise<void>((resolve) => {
        this._comps.authProvider.isServersConnected().then((server)=> {
            if (server.status != 200) {
              this._comps.errorCtrl.showError("Application Server not connected").then(() => {
                this._history.push('/', {});
                });        
            }
            resolve();      
        });
      });
    }
    _init_values() {
        this.username='';
        this.password='';
    }

    // handling events
    async _handleChange(e,type:string) {
      e.preventDefault();
      switch(type) {
        case 'username' : {
          await this.handleChangeUsername(e.target.value);
          break;
        }
        case 'password' : {
          await this.handleChangePassword(e.target.value);
          break;
        }
        case 'submit' : {
          await this.handleSubmit();
          break;
        }
        case 'register' : {
          await this.handleRegister(e.target.localName);
          break;
        }

      }
    }
    _handleFocus() {
        if(!this._Username.classList.contains('validated')) {
            this._Username.focus();
            return;
        } else if(!this._Password.classList.contains('validated')) {
            this._Password.focus();
            return;
        }
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
        this._handleFocus();
    }
    _handleButtonVisibility(type:string){
        if(type === 'add') {
          if(this.username.length > 0 && this.password.length > 0 ) {
            this._button.classList.add('visible');
          }
        }
        if(type === 'remove') {
          if(this._button.classList.contains('visible')) this._button.classList.remove('visible');
        }
    }
    async _handleSubmit(): Promise<void> {
        if(this.username.length > 0 && this.password.length > 0) {
          await presentLoading(this._loadingCtrl,'Authenticating...');
          this._User = {
              username: this.username,
              password: this.password,
          }
          // send data to our backend
          let cred:Credentials = this._User;
          const res:any = await this._comps.authProvider.authenticate(cred);
          if(res.status === 200) {
            if(typeof(res.result.token) != 'undefined'){
              let session:Session = res.result;
              this._comps.sessionProvider.saveSessionData(session);
              dismissLoading().then(() => {
                this._history.push('/home/connected', {});
              });           
            }
          } else {
            dismissLoading().then(() => {
              this._comps.errorCtrl.showError(res.message).then(() => {
                this._init_values();
              });
            });
          }
        }
        return Promise.resolve(); 
    }
    _handleRegister(tag:string): Promise<void> {
        if(tag === 'a') {
          this._history.push('/register', {});
        }
        return Promise.resolve(); 
    }
    async _handleChangeUsername(username:string): Promise<void> {
        const res: any = await validator.checkRegExp(username,REGEXP_USERNAME,
                                                      ERROR_USERNAME,DEBOUNCE_TIMEOUT);
        if(res.status === 200) {
          this.username = username;
          this._handleButtonVisibility('add');
          this._handleValidated(this._Username,'add');
        } else {
          this._comps.errorCtrl.showError(res.message).then(() => {
            this.username = '';
            this._handleButtonVisibility('remove');
            this._handleValidated(this._Username,'remove');
          });
        }
        return Promise.resolve(); 
    }
    async _handleChangePassword(password:string): Promise<void> {
        const res: any = await validator.checkRegExp(password,REGEXP_PASSWORD,
                                                      ERROR_PASSWORD,DEBOUNCE_TIMEOUT);
        if(res.status === 200) {
          this.password = password;
          this._handleButtonVisibility('add');
          this._handleValidated(this._Password,'add');
        } else {
          this._comps.errorCtrl.showError(res.message).then(() => {
            this.password = '';
            this._handleButtonVisibility('remove');
            this._handleValidated(this._Password,'remove');
          });   
        }
        return Promise.resolve(); 
    }

    // rendering
    render() {
        return (
          <ion-page class='show-page'>
            <app-header></app-header>    
            <ion-content>
                <div id='login-card' class='card'>
                  <div class="form">
                    <form class="login-form" onSubmit={(e) => this._handleChange(e,'submit')}>
                      <input class="entry username" id="username" type="text" placeholder="username" autofocus value={this.username} onInput={(event) => this._handleChange(event,'username')} />
                      <input class="entry password" id="password" type="password" placeholder="password" value={this.password} onInput={(event) => this._handleChange(event,'password')} />
                      <input class="button" id="login" type="submit" value="Login" />
                      <p class="message">Not registered? <a href="#" onClick={(e) => this._handleChange(e,'register')}>Create an account</a></p>
                    </form>
                  </div>
                </div>
            </ion-content>
          </ion-page>
        );
    }
}