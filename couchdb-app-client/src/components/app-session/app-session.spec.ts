import { TestWindow } from '@stencil/core/testing';
import { AppSession} from './app-session';
import { Session } from '../../global/interfaces';
import { LOCALSTORE_NAME } from '../../global/constants';

require('jest-localstorage-mock');

describe('app-session', () => {
    describe('instance', () => {
        let instance: any;
        beforeEach(async () => {
            instance = new AppSession();
        });
        afterEach(async () => {
            instance = null;
        });
        it('should build', () => {
            expect(instance).toBeTruthy();
        });
        it('should return currentSession null', () => {
            let retSession = instance.getCurrentSession();
            expect(JSON.stringify(retSession)).toBeNull;
        });
        it('should not get a Session data from local storage', async () => {
            let retSession = await instance.getSessionData();
            expect(localStorage.getItem).toHaveBeenLastCalledWith(LOCALSTORE_NAME);
            expect(JSON.stringify(retSession)).toBeNull;
            expect(Object.keys(localStorage.__STORE__).length).toBe(0);
        });    
        it('should set a Session data to local storage', () => {
            let session: Session = {
                user_id: 'joesmith',
                token: 'jSYt-uL2TaCoh0ywS8wc9g',
                password: '6j5RkdN8RquQ57ue3bFr2w',
                roles: ['user'],
                issued: 1517680659920,
                expires: 1517767059920
            };
            instance.saveSessionData(session);
            expect(localStorage.setItem).toHaveBeenLastCalledWith(LOCALSTORE_NAME, JSON.stringify(session));
            expect(localStorage.__STORE__[LOCALSTORE_NAME]).toBe(JSON.stringify(session));
            expect(Object.keys(localStorage.__STORE__).length).toBe(1);
        });
        it('should return the currentSession ', () => {
            let session: Session = {
                user_id: 'joesmith',
                token: 'jSYt-uL2TaCoh0ywS8wc9g',
                password: '6j5RkdN8RquQ57ue3bFr2w',
                roles: ['user'],
                issued: 1517680659920,
                expires: 1517767059920
            };
            instance.saveSessionData(session);
            let retSession = instance.getCurrentSession();
            expect(retSession.user_id).toEqual('joesmith');
            expect(retSession.token).toEqual('jSYt-uL2TaCoh0ywS8wc9g');
            expect(retSession.password).toEqual('6j5RkdN8RquQ57ue3bFr2w');
            expect(retSession.roles[0]).toEqual('user');
            expect(retSession.issued).toEqual(1517680659920);
            expect(retSession.expires).toEqual(1517767059920);
        });
        it('should get a Session data from local storage', async () => {
            let session: Session = {
                user_id: 'joesmith',
                token: 'jSYt-uL2TaCoh0ywS8wc9g',
                password: '6j5RkdN8RquQ57ue3bFr2w',
                roles: ['user'],
                issued: 1517680659920,
                expires: 1517767059920
            };
            instance.saveSessionData(session);
            let retSession = await instance.getSessionData();
            expect(localStorage.getItem).toHaveBeenLastCalledWith(LOCALSTORE_NAME);
            expect(JSON.stringify(retSession)).toBe(JSON.stringify(session));
            expect(Object.keys(localStorage.__STORE__).length).toBe(1);
        });
        it('should have removed key "LOCALSTORE_NAME" from local storage', () => {
            let session: Session = {
                user_id: 'joesmith',
                token: 'jSYt-uL2TaCoh0ywS8wc9g',
                password: '6j5RkdN8RquQ57ue3bFr2w',
                roles: ['user'],
                issued: 1517680659920,
                expires: 1517767059920
            };
            instance.saveSessionData(session);
            instance.removeSessionData()
            expect(localStorage.removeItem).toHaveBeenCalled();
            expect(localStorage.__STORE__[LOCALSTORE_NAME]).toBeUndefined;
            expect(localStorage.length).toBe(0);
        });
    });
    describe('rendering', () => {
        let element: any;
        let window: TestWindow;
        beforeEach(async () => {
            window = new TestWindow();
            element = await window.load({
                      components: [AppSession],
                html: '<app-session></app-session>'
            });
        });
        afterEach(async () => {
            window = null;
          });
              
        it('should render', async () => {
            await window.flush();
            expect(element).not.toBeNull();
        });
            
    });
});