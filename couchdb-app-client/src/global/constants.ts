
export const SERVER_ADDRESS: string = 'http://localhost:3000/'; // application server address
export const LOCALSTORE_NAME: string = 'testpouchdb';           // name of the browser local store (client)
export const POUCHDB_NAME: string = 'jpqtestdb';                // name of the POUCHDB database (client)
export const COUCHDB_NAME: string = 'jpqtest';                  // name of the COUCHDB database (server)

// REGEXP expression for Login and Register Pages
export const REGEXP_NAME: string = '^[A-Za-z -]{3,25}$';
export const REGEXP_USERNAME: string = '^[A-Za-z0-9]{3,}$';
export const REGEXP_PASSWORD: string = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$';
export const REGEXP_EMAIL: string = '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+?\\.[a-zA-Z0-9]{2,6}$';
// Others
export const FETCH_TIMEOUT:number = 2000;
export const LOADING_TIMEOUT:number = 2000;
export const ELLIPSIS_NUMBER_WORDS:number = 20;
export const DEBOUNCE_TIMEOUT:number = 1000;

// COUCHDB / POUCHDB Design Documents
export const DESIGN_DOCS = ['{"_id":"_design/news",\
"views":{"display_by_date_created":{"map":"function(doc){ if(doc.type == \'news\'){if(doc.display){emit(doc.dateCreated)};} }"},\
"all_by_date_created":{"map":"function(doc){ if(doc.type == \'news\'){emit(doc.dateCreated);}}"}},\
"language":"javascript"}'];

// Error for REGEXP
export const ERROR_NAME: string = 'Minimum 3, Maximum 25 characters [A-Za-z0-9]';
export const ERROR_USERNAME: string = 'Minimum 3 characters [A-Za-z0-9]';
export const ERROR_PASSWORD: string = 'Minimum 6 characters at least one of each [A-Z],[a-z],[0-9]';
export const ERROR_EMAIL: string = "Must have at least a '.' character after '@' character ";
