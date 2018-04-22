export interface User {
    name?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
}
export interface Session {
    user_id?: string;
    token?: string;
    password?: string;
    roles?: Array<string>;
    issued?: number;
    expires?: number;
    provider?: string;
    ip?: string;
    userDBs?: any;
}
export interface Credentials {
    username?: string;
    password?: string;   
}
export interface PDBOptions {
    pouchDB?: any;
    adapter?: string;
    designDocs?: boolean;
}
export interface News {
    _id?: string;
    _rev?: string;
    _attachments?: any;
    type?: string;
    title?: string;
    author?: string;
    ellipsis?: string;
    display?: boolean;
    dateCreated?: string;
    dateUpdated?: string;

}
export interface PopOptions {
    component: any;
    componentProps?: any;
    ev: Event;
}

