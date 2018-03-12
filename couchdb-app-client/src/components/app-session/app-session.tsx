import { Component, Method } from '@stencil/core';
import { Session } from '../../global/interfaces';
import { LOCALSTORE_NAME } from '../../global/constants';
//

@Component({
  tag: 'app-session',
  styleUrl: 'app-session.scss'
})
export class AppSession {
    private _currentSession: any;

    @Method()
    saveSessionData(data:Session) {
        let storage:Storage = window.localStorage;
        storage.setItem(LOCALSTORE_NAME,JSON.stringify(data));
        this._currentSession = data;
    } 
    @Method()
    getSessionData(): Promise<Session> {
        return new Promise<Session>(async (resolve) => {
            let storage:Storage = window.localStorage;
            this._currentSession = await JSON.parse(storage.getItem(LOCALSTORE_NAME));
            resolve(this._currentSession);
        });
    }
    @Method()
    removeSessionData(): Promise<Session> {
        return new Promise<Session>(async (resolve) => {
            let storage:Storage = window.localStorage;
            await storage.removeItem(LOCALSTORE_NAME);
            this._currentSession = null;
            resolve();
        });
    }
    @Method()
    getCurrentSession() : Session {
        return this._currentSession;
    }
    
    // rendering
    render() {
        return (
          <slot />
        );
    }
}    