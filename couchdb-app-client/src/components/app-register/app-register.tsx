import { Component, Prop, Element, Method, State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { LoadingController } from '@ionic/core';
import { initializeComponents, initializeMocks, presentLoading, dismissLoading } from '../../helpers/ui-utilities';
import { User, Session } from '../../global/interfaces'
import { validator } from '../../validators/validators'
import { DEBOUNCE_TIMEOUT, REGEXP_NAME, REGEXP_USERNAME, REGEXP_PASSWORD, REGEXP_EMAIL, ERROR_NAME, ERROR_USERNAME, ERROR_PASSWORD, ERROR_EMAIL } from '../../global/constants';


@Component({
  tag: 'app-register',
  styleUrl: 'app-register.scss'
})
export class AppRegister {

    private _history: RouterHistory | any;
    private _loadingCtrl: LoadingController | any;
    private _User: User;
    private _Name: HTMLElement;
    private _Email: HTMLElement;
    private _Username: HTMLElement;
    private _Password: HTMLElement;
    private _ConfirmPassword: HTMLElement;
    private _button: HTMLElement;
    private _text: HTMLElement;
    private _comps: any;  

    @Element() el: HTMLElement;
    @State() name: string = '';
    @State() email: string = '';
    @State() username: string = '';
    @State() password: string = '';
    @State() conf_password:string = '';
    @Prop() history: RouterHistory;
    @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: LoadingController;

    @Method()
    isServersConnected(): Promise<void>{
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
    setUserData(data:User){
        // used for unit testing only
        this.name = data.name;
        this.email = data.email;        
        this.username = data.username;
        this.password = data.password;        
        this.conf_password = data.confirmPassword;        
    }
    @Method()
    handleSubmit(): Promise<void> {
      return this._handleSubmit();
    }
    @Method()
    handleChangeName(name:string, debTimeout: number): Promise<void> {
      return this._handleChangeName(name,debTimeout);
    }
    @Method()
    handleChangeEmail(email:string, debTimeout: number): Promise<void> {
      return this._handleChangeEmail(email,debTimeout);
    }
    @Method()
    handleChangeUsername(username:string, debTimeout: number): Promise<void> {
      return this._handleChangeUsername(username,debTimeout);
    } 
    @Method()
    handleChangePassword(password:string, debTimeout: number): Promise<void> {
      return this._handleChangePassword(password,debTimeout);
    }
    @Method()
    handleChangeConfirmPassword(confPassword:string, debTimeout: number): Promise<void> {
      return this._handleChangeConfirmPassword(confPassword,debTimeout);
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
        this._Name = this.el.querySelector('#name');
        this._Email = this.el.querySelector('#email');
        this._Username = this.el.querySelector('#username');
        this._Password = this.el.querySelector('#password');
        this._ConfirmPassword = this.el.querySelector('#confirmPassword');
        this._button = this.el.querySelector('.form .register-form .button');
        this._text = this.el.querySelector('.form .submit-warning');
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
        this.name = '';
        this.email =  '';
        this.username = '';
        this.password = '';
        this.conf_password = '';
    }

    // handling events
    async _handleChange(e,type:string) {
        e.preventDefault();
        switch(type) {
            case 'name' : {
                await this.handleChangeName(e.target.value,DEBOUNCE_TIMEOUT);
                break;
            }
            case 'email' : {
                await this.handleChangeEmail(e.target.value,DEBOUNCE_TIMEOUT);
                break;
            }
            case 'username' : {
                await this.handleChangeUsername(e.target.value,DEBOUNCE_TIMEOUT);
                break;
            }
            case 'password' : {
                await this.handleChangePassword(e.target.value,DEBOUNCE_TIMEOUT);
                break;
            }
            case 'confirmPassword' : {
                await this.handleChangeConfirmPassword(e.target.value,DEBOUNCE_TIMEOUT);
                break;
            }
            case 'submit' : {
                await this.handleSubmit();
                break;
            }
        }
    }
    _handleFocus() {
        if(!this._Name.classList.contains('validated')) {
            this._Name.focus();
            return;
        } else if(!this._Email.classList.contains('validated')) {
            this._Email.focus();
            return;
        } else if(!this._Username.classList.contains('validated')) {
            this._Username.focus();
            return;
        } else if(!this._Password.classList.contains('validated')) {
            this._Password.focus();
            return;
        } else if(!this._ConfirmPassword.classList.contains('validated')) {
            this._ConfirmPassword.focus();
            return;
        }
    }
    _handleButtonVisibility(type:string){
        if(type === 'add') {
            if(this.name.length > 0 && this.email.length > 0 && this.username.length > 0 &&
                this.password.length > 0 && this.conf_password.length > 0) {
                this._button.classList.add('visible');
                this._text.classList.add('hidden');
            }
        }
        if(type === 'remove') {
            if(this._button.classList.contains('visible')) this._button.classList.remove('visible');
            if(this._text.classList.contains('hidden')) this._text.classList.remove('hidden');
        }
    }
    async _handleSubmit() {
        if(this.name.length > 0 && this.email.length > 0 && this.username.length > 0 && 
            this.password.length > 0 && this.conf_password.length > 0) {
            await presentLoading(this._loadingCtrl,'Registering...');
            this._User = {
            name: this.name,
            email: this.email,
            username: this.username,
            password: this.password,
            confirmPassword: this.conf_password
            }
            const res: any = await this._comps.authProvider.register(this._User);
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
    async _handleChangeName(name:string, debTimeout: number) {
        const res:any = await validator.checkRegExp(name,REGEXP_NAME,
                                                    ERROR_NAME,debTimeout);
        if(res.status === 200) {  
            this.name = name;
            this._handleButtonVisibility('add');
            this._handleValidated(this._Name,'add');
        } else {
            this._comps.errorCtrl.showError(res.message).then(() => {
                this._handleButtonVisibility('remove');
                this._handleValidated(this._Email,'remove');
            });
        }
    }
    async _handleChangeEmail(email: string, debTimeout: number) {
        const res:any = await validator.checkRegExp(email,REGEXP_EMAIL,
                                                    ERROR_EMAIL,debTimeout);
        if(res.status === 200) {  
            const data:any = await validator.checkEmail(email,this._comps.authProvider,debTimeout);
            if(data.status === 200) {
                this.email = email;
                this._handleButtonVisibility('add');
                this._handleValidated(this._Email,'add');
            } else {
                this._comps.errorCtrl.showError(data.message).then(() => {
                //    event.target.value = '';
                    this.email = '';
                    this._handleValidated(this._Email,'remove');
                });
            }
        } else {
            this._comps.errorCtrl.showError(res.message).then(() => {
                this._handleButtonVisibility('remove');
                this._handleValidated(this._Email,'remove');
            });
        }
    }
    async _handleChangeUsername(username: string, debTimeout: number) {
        const res:any = await validator.checkRegExp(username,REGEXP_USERNAME,
                                                        ERROR_USERNAME,debTimeout);
        if(res.status === 200) {  
            const data:any = await validator.checkUsername(username,this._comps.authProvider,debTimeout);
            if(data.status === 200) {
                this.username = username;
                this._handleButtonVisibility('add');
                this._handleValidated(this._Username,'add');
            } else {
                this._comps.errorCtrl.showError(data.message).then(() => {
                //    event.target.value = '';
                    this.username = '';
                    this._handleValidated(this._Username,'remove');
                });
            }
        } else {
            this._comps.errorCtrl.showError(res.message).then(() => {
                this._handleButtonVisibility('remove');
                this._handleValidated(this._Username,'remove');
            });
        }
    }
    async _handleChangePassword(password:string, debTimeout: number) {
        const res: any = await validator.checkRegExp(password,REGEXP_PASSWORD,
                                                        ERROR_PASSWORD,debTimeout);
        if(res.status === 200) {
            this.password = password;
            this._handleButtonVisibility('add');
            this._handleValidated(this._Password,'add');
        } else {
            this._comps.errorCtrl.showError(res.message).then(() => {
                this.password = '';
                this.conf_password = '';
                this._handleButtonVisibility('remove');
                this._handleValidated(this._Password,'remove');
            });   
        }
    }
    async _handleChangeConfirmPassword(confPassword: string, debTimeout: number){
        const res: any = await validator.checkRegExp(confPassword,REGEXP_PASSWORD,
                                                        ERROR_PASSWORD,debTimeout);
        if(res.status === 200) {
            const data:any = await validator.checkPassword(this.password,confPassword,debTimeout);
            if(data.status === 200) {
                this.conf_password = confPassword;
                this._handleButtonVisibility('add');
                this._handleValidated(this._ConfirmPassword,'add');
            } else {
                this._comps.errorCtrl.showError(data.message).then(() => {
                //    event.target.value = '';
                    this.conf_password = '';
                    this._handleValidated(this._ConfirmPassword,'remove');
                });
            }
        } else {
            this._comps.errorCtrl.showError(res.message).then(() => {
                this._handleButtonVisibility('remove');
                this._handleValidated(this._ConfirmPassword,'remove');
            });
        }   
    }
  
    // rendering
    render() {
        return (
          <ion-page class='show-page'>
            <app-header></app-header>   
            <ion-content>
              <div id='register-card' class='card'>
                  <div class="form">
                    <form class="register-form" onSubmit={(e) => this._handleChange(e,'submit')}>
                      <input class="entry name" id="name" type="text" placeholder="Name"  autofocus value={this.name} onInput={(event) => this._handleChange(event,'name')} />
                      <input class="entry email" id="email" type="email" placeholder="Email" value={this.email} onInput={(event) => this._handleChange(event,'email')} />
                      <input class="entry username" id="username" type="text" placeholder="Username" value={this.username} onInput={(event) => this._handleChange(event,'username')} />
                      <input class="entry password" id="password" type="password" placeholder="Password" value={this.password} onInput={(event) => this._handleChange(event,'password')} />
                      <input class="entry confirmPassword" id="confirmPassword" type="password" placeholder="Confirm Password" value={this.conf_password} onInput={(event) => this._handleChange(event,'confirmPassword')} />
                      <input class="button" id="register" type="submit" value="Create your Account" />
                    </form>
                    <p class="submit-warning">You must fill out all fields above correctly before you can create your account.</p>
                  </div>
                </div>
            </ion-content>
          </ion-page>
        );
    }
}