var config = module.exports = {};

hostname ='localhost';
port = '3000';
protocol = 'http://';

config.CouchDB = {};

config.CouchDB.hostname = 'localhost';
config.CouchDB.port ='5984';
config.CouchDB.protocol = 'http://';
config.CouchDB.sharedDB = 'jpqtest';   // replace by your database name
config.CouchDB.config = {
    dbServer: {
      protocol: config.CouchDB.protocol,
      host: config.CouchDB.hostname + ':' + config.CouchDB.port,
      user: 'jeep',                    // replace by your admin user
      password: 'c0jeep',              // replace by your admin password
      userDB: config.CouchDB.sharedDB + '-users',
      couchAuthDB: '_users'
    },
    mailer: {
      fromEmail: 'gmail.user@gmail.com',
      options: {
        service: 'Gmail',
          auth: {
            user: 'gmail.user@gmail.com',
            pass: 'userpass'
          }
      }
    },
    security: {
      maxFailedLogins: 3,
      lockoutTime: 600,
      tokenLife: 86400,
      loginOnRegistration: true,
    },
    userDBs: {
      defaultDBs: {
        shared: [config.CouchDB.sharedDB]
      },
      model: {
        [config.CouchDB.sharedDB]: {
          permissions: ['_reader', '_writer', '_replicator'],
          type: 'shared',
          adminRoles: [],
          memberRoles: []
          }
      }
    },
    providers: {
      local: true
    }
}
