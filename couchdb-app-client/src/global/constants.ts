
export const SERVER_ADDRESS = 'http://localhost:3000/'; // application server address
export const LOCALSTORE_NAME = 'testpouchdb';           // name of the browser local store (client)
export const POUCHDB_NAME = 'jpqtestdb';                // name of the POUCHDB database (client)
export const COUCHDB_NAME = 'jpqtest';                  // name of the COUCHDB database (server)

// REGEXP expression for Login and Register Pages
export const REGEXP_NAME = '^[A-Za-z -]{3,25}$';
export const REGEXP_USERNAME = '^[A-Za-z0-9]{3,}$';
export const REGEXP_PASSWORD = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$';
export const REGEXP_EMAIL = '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+?\\.[a-zA-Z0-9]{2,6}$';
// Others
export const FETCH_TIMEOUT = 2000;
export const ELLIPSIS_NUMBER_WORDS = 20;
export const DEBOUNCE_TIMEOUT = 1000;

// COUCHDB / POUCHDB Design Documents
export const DESIGN_DOCS = ['{"_id":"_design/news",\
"views":{"display_by_date_created":{"map":"function(doc){ if(doc.type == \'news\'){if(doc.display){emit(doc.dateCreated)};} }"},\
"all_by_date_created":{"map":"function(doc){ if(doc.type == \'news\'){emit(doc.dateCreated);}}"}},\
"language":"javascript"}'];

// Error for REGEXP
export const ERROR_NAME = 'Minimum 3, Maximum 25 characters [A-Za-z0-9]';
export const ERROR_USERNAME = 'Minimum 3 characters [A-Za-z0-9]';
export const ERROR_PASSWORD = 'Minimum 6 characters at least one of each [A-Z],[a-z],[0-9]';
export const ERROR_EMAIL = "Must have at least a '.' character after '@' character ";
