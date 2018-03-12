import { Component, Method } from '@stencil/core';

@Component({
  tag: 'app-connection',
  styleUrl: 'app-connection.scss'
})
export class AppConnection {
    private _conMode: string;
    @Method()
    setConnection(conMode:string) {
      this._conMode = conMode;
    }
    @Method()
    getConnection() {
      return this._conMode;
    }
    // rendering
    render() {
        return (
          <slot />
        );
    }
}
