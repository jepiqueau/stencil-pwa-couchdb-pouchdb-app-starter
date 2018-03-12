import { RouterHistory } from '@stencil/router';
import { ToastController, LoadingController, Loading } from '@ionic/core';
import { Session } from '../global/interfaces';


let loading: Loading;
const showToast = async (toastCtrl: ToastController,msg:string): Promise<void> => {
  const toast = await toastCtrl.create({ message: msg, duration: 1500 });
  toast.present();
}
const presentLoading = async (loadingCtrl:LoadingController,message:string): Promise<void> => {
  loading = await loadingCtrl.create({
    content: message
  });
  loading.present();
}
const dismissLoading = async (): Promise<void> => {
  loading.dismiss();
}

const getIonApp = (docMock?: Document): Promise<any> => {
  const doc: Document = docMock ? docMock : document;
  const appElement: HTMLElement = doc.querySelector('ion-app');
  return Promise.resolve(appElement ? appElement : null);
}
const getPouchDBProvider = async (docMock?: Document): Promise<any> => {
  const doc: Document = docMock ? docMock : null;
  let appElement: any = await getIonApp(doc);
  return  Promise.resolve(appElement ? appElement.querySelector('app-pouchdb') : null);
}
const getErrorController = async (docMock?: Document): Promise<any> => {
  const doc: Document = docMock ? docMock : null;
  let appElement: any = await getIonApp(doc);
  return  Promise.resolve(appElement ? appElement.querySelector('app-error') : null);
}
const getAuthProvider = async (docMock?: Document): Promise<any> => {
  const doc: Document = docMock ? docMock : null;
  let appElement: any = await getIonApp(doc);
  return  Promise.resolve(appElement ? appElement.querySelector('app-auth') : null);
}
const getSessionProvider = async (docMock?: Document): Promise<any> => {
  const doc: Document = docMock ? docMock : null;
  let appElement: any = await getIonApp(doc);
  return  Promise.resolve(appElement ? appElement.querySelector('app-session') : null);
}
const getConnectionProvider = async (docMock?: Document): Promise<any> => {
  const doc: Document = docMock ? docMock : null;
  let appElement: any = await getIonApp(doc);
  return  Promise.resolve(appElement ? appElement.querySelector('app-connection') : null);
}
const checkServersConnected = (history: RouterHistory | any, loadingCtrl: LoadingController | any,
                          comps:any, page:string,loadingMsg:string): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    await presentLoading(loadingCtrl,loadingMsg);
    let session: Session = await comps.sessionProvider.getSessionData();
    let server: any = await comps.authProvider.isServersConnected();
    if(session === null && (server.status === 400 || 
        (server.status === 200 && !server.result.dbserver))) {
      dismissLoading().then(() => {
        comps.errorCtrl.showError("Application Server not connected").then(() => {
           resolve();
        });
      });
    } else {
      comps.authProvider.reauthenticate(server).then((data) => {
        if(data.status === 200 && server.status === 200) {
          dismissLoading().then(() => {
            if (page === 'page') {
              comps.connectionProvider.setConnection('connected');
              history.push('/home/connected', {});
            }
            resolve();
          });
        } else if (data.status === 200 && server.status === 400) {
          dismissLoading().then(() => {
            comps.errorCtrl.showError("Working Offline").then(() => {
              if (page === 'page') {
                comps.connectionProvider.setConnection('offline');
                history.push('/home/offline', {});
              }
              resolve();
            });
          });        
        } else if(server.status === 200) {
          dismissLoading().then(() => {
            comps.errorCtrl.showError(data.message).then(() => {
              history.push('/login', {}); 
              resolve();
            });              
          });
        }
      });
    }
  });
}

const initializeMocks = (components:any,mocks:any): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    if(components.authProvider) components.authProvider = mocks.authProvider;
    if(components.sessionProvider) components.sessionProvider = mocks.sessionProvider;
    if(components.pouchDBProvider) components.pouchDBProvider = mocks.pouchDBProvider;
    if(components.errorCtrl) components.errorCtrl = mocks.errorCtrl;
    if(components.loadingCtrl) components.loadingCtrl = mocks.loadingCtrl;
    if(components.connectionProvider) components.connectionProvider = mocks.connectionProvider;
    resolve();
  });
}

const initializeComponents = (components:any,docMock?: Document):Promise<void> => {
  return new Promise<void>(async (resolve) => {
    const doc: Document = docMock ? docMock : null;
    if(components.errorCtrl) components.errorCtrl = await getErrorController(doc);
    if(components.authProvider) components.authProvider = await getAuthProvider(doc);
    if(components.authProvider && components.authProvider === null) components.errorCtrl.showError('Error: No Authentication Provider');
    if(components.sessionProvider) components.sessionProvider = await getSessionProvider(doc);
    if(components.sessionProvider && components.sessionProvider === null) components.errorCtrl.showError('Error: No Session Provider');
    if(components.pouchDBProvider) components.pouchDBProvider = await getPouchDBProvider(doc);
    if(components.pouchDBProvider && components.pouchDBProvider === null) components.errorCtrl.showError('Error: No PouchDB Provider');
    if(components.connectionProvider) components.connectionProvider = await getConnectionProvider(doc);
    if(components.connectionProvider && components.connectionProvider === null) components.errorCtrl.showError('Error: No Connection Provider');
    resolve();
  }); 
}
export { showToast, presentLoading, dismissLoading, getPouchDBProvider, 
        getErrorController, getAuthProvider, getSessionProvider,
        checkServersConnected, initializeMocks,initializeComponents,
        getIonApp, getConnectionProvider}
