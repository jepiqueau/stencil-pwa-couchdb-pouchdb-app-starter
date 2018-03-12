var express = require('express');
var CheckServerCtrl = require('./controllers/checkserver');
var CheckServerDBCtrl = require('./controllers/checkserverdb');
var SuperLogin = require('superlogin');
var config = require('./config');

module.exports = function(app){
    var serverRoutes = express.Router();

    // Server Routes
    serverRoutes.get('/',CheckServerCtrl.receiveServerCheck);
    serverRoutes.get('/',CheckServerDBCtrl.serverDBCheck);
    serverRoutes.get('/',CheckServerCtrl.sendServerCheck);

    // Set up routes
    app.use('/server',serverRoutes);
    // Initialize SuperLogin
    var superlogin = new SuperLogin(config.CouchDB.config);
    // Mount SuperLogin's routes to our app
    app.use('/auth', superlogin.router);
    
}