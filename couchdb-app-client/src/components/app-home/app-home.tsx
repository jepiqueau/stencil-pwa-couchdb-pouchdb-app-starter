import { Component, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {
  @Prop() match: MatchResults;
  @State() conMode: string;
  private _pageHome: string;

  componentWillLoad() {
    if (this.match && this.match.params.conmode) {
      this.conMode = this.match.params.conmode === 'connected' ? 'connected' : 'offline';
    }
  }
  componentWillUpdate() {
    if (this.match && this.match.params.mode) {
      this.conMode = this.match.params.mode === 'connected' ? 'connected': 'offline';
    }
  }

// rendering 
  render() {
    this._pageHome = 'home/'+this.conMode;
    return (
      <ion-page>
        {this.conMode === 'connected' ? <app-header menu logout></app-header> : <app-header menu></app-header>} 
        <app-menu page={this._pageHome}></app-menu>
        <ion-content>
          <app-logo width="75%"></app-logo>
          <div class="text">
              <h2>Welcome to the Jeep PouchDB Application Starter</h2>
              <h3>based on the Ionic PWA Toolkit</h3>
          </div>
        </ion-content>
      </ion-page>
    );
  }
}
//         
