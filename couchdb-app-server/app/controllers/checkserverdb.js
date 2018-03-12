var request = require('request');
var config = require('../config');
exports.serverDBCheck = function(req,res,next){
    req.dbserver = false;
    if(typeof req.server.server === 'boolean') {
        const url = config.CouchDB.protocol + config.CouchDB.hostname + ':' +
        config.CouchDB.port + '/' + config.CouchDB.sharedDB + '-users';
        var options = {
            host: config.CouchDB.hostname,
            port: config.CouchDB.port,
            path: '/' + config.CouchDB.sharedDB + '-users',
        };
        var handleError = function () {
            req.dbserver = {dbserver:false};
            next();                 
        }; 
    
        var dbrequest = request({url:url,json:true}, function (err,res,body) {
            if(err) handleError();
                req.dbserver = {dbserver:true};
                next();
        });

        dbrequest.on('socket', function(socket) { 
            socket.setTimeout(2000, function () {   // set short timeout so discovery fails fast
                handleError();
                dbrequest.abort();    // kill socket
            });
            socket.on('error', function (err) { // this catches ECONNREFUSED events
                handleError();
                dbrequest.abort();    // kill socket
            });
        }); // handle connection events and errors
    
        dbrequest.on('error', function (e) {  // happens when we abort
            handleError();
        });

    } else {
        next();
    }   
}

