import { mockElement } from './mock';

export const mockGetEl = mockElement('app-auth') as HTMLElement;

let isServer: boolean = false;
let res: any = null;
let resData: any = null;
export const mockGetIsServer = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        resolve(isServer);
    });
});
export const mockReauthenticate = jest.fn().mockImplementation((server: any,options?: any) => {
    let opt: any = options ? options: null;
    let db: any = opt !== null && opt.db ? opt.db : null;
    return new Promise((resolve ) => {
        if(res === null || resData === null || server === null) resolve();
        isServer = server !== null && server.status === 200 ? server.result.server : false;
        if(db === null) {
            if(res.status === 200 && resData.status === 200) {
                resolve({status:res.status,result:res.result});
            } else {
                if(resData.status === 200) {
                    resolve({status:200});
                } else {
                    resolve({status:resData.status,message:resData.message});                  
                }
            }
        } else {
            resolve({status:200});
        }
    });
});
export const mockAuthenticate = jest.fn().mockImplementation((user: any) => {
    return new Promise((resolve ) => {
        resolve(res);
    });
});
export const mockValidateUsername = jest.fn().mockImplementation((username: string) => {
    return new Promise((resolve ) => {
        resolve(res);
    });
});
export const mockValidateEmail = jest.fn().mockImplementation((email: string) => {
    return new Promise((resolve ) => {
        resolve(res);
    });
});
export const mockRegister = jest.fn().mockImplementation((user: any) => {
    return new Promise((resolve ) => {
        if(res === null) resolve();
        resolve(res);
    });
});
export const mockLogout = jest.fn().mockImplementation(() => {
    let session: any = res.session ? res.session : null;
    return new Promise((resolve ) => {
        isServer = false;
        if(res === null) resolve();
        if(session !== null) {
            if(res.status === 200) {
                resolve({status: res.status,success: res.success});
            } else {
                resolve({status: res.status,message: res.message});
            }
        } else {
            resolve({status:400 , message:"No session opened"});                                          
        }
    });
});
export const mockIsServersConnected = jest.fn().mockImplementation(() => {
    return new Promise((resolve ) => {
        if(res === null) {
            isServer = false;
            resolve({status:400,message:"Application Server not connected"});
        }
        isServer = res !== null && res.status === 200 ? res.result.server : false;
        resolve(res);
    });
});
export const responseMock = jest.fn().mockImplementation((response): Promise<void> => {
    res = response;
    return Promise.resolve();
});
export const dataReauthenticateMock = jest.fn().mockImplementation((data) => {
    resData = data;
});
export const restoreMock = jest.fn().mockImplementation(() => {
    isServer = false;
    res  = null;
    resData  = null;
});
export const resetMock = jest.fn().mockReset();

const mockAuthProvider = jest.fn().mockImplementation(() => {
    return {
        el: mockGetEl,
        getIsServer: mockGetIsServer,
        reauthenticate : mockReauthenticate,
        authenticate: mockAuthenticate,
        validateUsername: mockValidateUsername,
        validateEmail: mockValidateEmail,
        register: mockRegister,
        logout: mockLogout,
        isServersConnected: mockIsServersConnected,
        responseMock: responseMock,
        dataReauthenticateMock: dataReauthenticateMock,
        restoreMock: restoreMock,
        resetMock: resetMock
    };
});

export default mockAuthProvider;
