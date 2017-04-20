#!/usr/bin/node
// Read environment variables
require('dotenv').config({path: '../process.env'});
var debug = require('debug')('RPiWebServer');
var app_package = require('../app');
var app = app_package.app;

process.on('uncaughtException', err => {
    console.log("uncaught exception");
    console.log(err);
});
process.on('unhandledRejection', (reason, p) => {
    console.log("unhandled rejection");
    console.log(p);
    console.log(reason);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
