import { Component, Prop, Element, State, Method } from '@stencil/core';
import { RouterHistory } from '@stencil/router';


@Component({
  tag: 'app-menu',
  styleUrl: 'app-menu.scss'
})
export class AppMenu {

    @Element() el: HTMLElement;
    @Prop() history: RouterHistory;
    @Prop() page: string;
    @State() pageHome: string;
    @State() newsOption: boolean = false;

    private _page: string;
    private _conMode: string;

    @Method()
    handleClick() {
        this.newsOption = !this.newsOption;
    }
    componentDidLoad() {
    }
    
    // rendering
    render() {
        let page = this.page ? this.page : 'home/offline';
        this._conMode = page.slice(-7);
        this.pageHome = this._conMode === 'offline' ? 'home/offline' : 'home/connected';
        this._page = page ? page : this.pageHome;
        return (
            <main>        
                <ion-menu contentId="navId">
                    <ion-header>
                        <ion-toolbar>
                            <ion-title>Menu</ion-title>
                        </ion-toolbar>
                    </ion-header>
                    <ion-content>
                        <ion-list>
                            {this._page.substring(0, 4) !== 'home' ?
                                <ion-item>
                                <stencil-route-link url={'/'+this.pageHome}>
                                    <ion-button buttonType='bar-button'>
                                        Home
                                    </ion-button>
                                </stencil-route-link>
                                </ion-item>
                            : null }
                                {this.newsOption ? 
                                <slot>
                                    {this._page.substring(0, 11) !== 'news-create' ?
                                        <ion-item>
                                            <stencil-route-link url='/news/create'> 
                                                <ion-button buttonType='bar-button'onClick={this.handleClick.bind(this)}> 
                                                News Create 
                                                </ion-button>
                                            </stencil-route-link> 
                                        </ion-item> 
                                    : null }
                                    {this._page.substring(0, 12) !== 'news-display' ?
                                        <ion-item>                    
                                            <stencil-route-link url='/news/display'> 
                                                <ion-button buttonType='bar-button'onClick={this.handleClick.bind(this)}> 
                                                News Display 
                                                </ion-button>
                                            </stencil-route-link>                      
                                        </ion-item> 
                                    : null }
                                </slot>                     
                            : <ion-item>
                                <ion-button buttonType='bar-button' onClick={this.handleClick.bind(this)}>
                                    News
                                </ion-button>
                            </ion-item>}
                            {this._page.substring(0, 7) !== 'profile' ?
                                <ion-item>
                                <stencil-route-link url='/profile/stencil'>
                                    <ion-button buttonType='bar-button'>
                                        Profile
                                    </ion-button>
                                </stencil-route-link>
                                </ion-item>
                            : null}
                        </ion-list>
                    </ion-content>
                </ion-menu> 
                <ion-nav id="navId"></ion-nav>            
            </main>

        )
    }   
}
