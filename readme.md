# CouchDB/Pouchdb App Starter
The CouchDB/PouchDB App Starter is an application based on the Ionic PWA Toolkit Beta.This will get you started with applications that work offline as they do online as the data are stored locally while offline and then synchronize it with CouchDB when application servers are back online.

## Warning
This project is a Beta release and has only been tested with CouchDB and Node Application server installed locally. The CouchDB database is shared to all users.

## Features included in the CouchDB/Pouchdb App Starter

    . Node Application Server to connect to CouchDB
        . Authentication routes using Superlogin
        . Server connectivity route
    
    . Client Application
        . Ionic PWA Toolkit Beta
        . PouchDB local data store
        . So called 'Angular Provider' as Stencil Web Component
        . Full Unit Testing using Web Component Mocking
        . Authentication Session stored locally
        . Showing Toast message using Ionic 4 ToastController
        . Showing Loading message using Ionic 4 LoadingController
        . Page navigation using Routing and Ionic 4 Menu and MenuController

## Getting Started

clone this repo to a new directory:

```
git clone https://github.com/jepiqueau/stencil-pwa-couchdb-pouchdb-app-starter.git pwa-couchdb-app
cd pwa-couchdb-app
git remote rm origin
```


### CouchDB

Install CouchDB locally 
    . on Windows see http://docs.couchdb.org/en/2.0.0/install/windows.html
    . on Mac OsX see http://docs.couchdb.org/en/1.6.1/install/mac.html

After installation and initial startup, visit Fauxton at http://127.0.0.1:5984/_utils#setup and configure CouchDb as “Single-Node-Setup”, then define the Admin user and password. You are now up and running.

### Server Application
. Install the server application

```
cd couchdb-app-server
npm install
```
. Open the app/config.js and replace
```
    config.CouchDB.sharedDB = 'jpqtest';   // replace by your database name
    user: 'jeep',                          // replace by your admin user
    password: 'c0jeep',                    // replace by your admin password
```
. Start the server application

```
node server
```

. Preload some data in the database if you wish (not required, you can start creating news from the client app)

on MAC OSX
```
./createadatabase.sh dbname username password
```
    where dbname is your database name, username the admin user and password the admin password.

on Windows (not yet fixed)

Visit http://127.0.0.1:5984/_utils/#/_all_dbs
    you should see your database in the list of databases, select your database you should have 4 documents loaded

### Client Application
```
cd couchdb-app-server
npm install
```
Open the src/global/conctants.ts and update the 4 constants accordingly with your wish
```
    export const SERVER_ADDRESS = 'http://localhost:3000/'; // application server address
    export const LOCALSTORE_NAME = 'testpouchdb';           // name of the browser local store (client)
    export const POUCHDB_NAME = 'jpqtestdb';                // name of the POUCHDB database (client)
    export const COUCHDB_NAME = 'jpqtest';                  // name of the COUCHDB database (server)
```

#### Start the client application
```
npm start
```
#### Run Tests
```
npm test
```
#### Build PWA 
```
npm run build
```

### Server Application Issues
if you got this error reported on the server console when a client try to login please do the following:
```
go to the index.js of the node_modules/couch-pwd on the server app and add the following line 

var digest = 'SHA1';

just after 
var encoding = 'hex';

and replace the line 
    crypto.pbkdf2(pwd, salt, iterations, keylen, function(err, hash) {
with
    crypto.pbkdf2(pwd, salt, iterations, keylen, digest, function(err, hash) {

```
This problem has been reported to Superlogin and couch-pwd

### Client Application Issues
In running the Client Application, you will see some messages in the console coming from the set-up of PouchDB the first time you log and also some messages from the MenuController and the Menu which do not avoid the application to run smoothly.

ie:
TypeError: Cannot read property 'canGoBack' of null
TypeError: Cannot read property 'remove' of undefined

The PouchDB-browser library cannot be imported as Stencil cannot succesfully compile the application. 
Identified Reasons:
    the Stencil compile process should, when compiling the debug library used by Pouchdb, compile the browser.js and not the node.js and at the runtime the process should have a process.type equal to 'renderer'.

so the library is loaded in the index.html as
```
<script src="//cdn.jsdelivr.net/npm/pouchdb@6.4.3/dist/pouchdb.min.js"></script> 
```






 
