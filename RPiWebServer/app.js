"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: './process.env' });
const express = require("express");
const path = require("path");
const index_1 = require("./routes/index");
const user_1 = require("./routes/user");
const climate_1 = require("./routes/climate");
const ip = require("./helpers/ip");
// Keep alive message, log every 5 minutes that app is running
setInterval(() => { var d = new Date(); console.log(d.toISOString() + " App is running"); }, 300000);
var app = express();
exports.app = app;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Log request and source IP
app.use(function (req, res, next) {
    var req_ip = ip.get_request_ip(req);
    var timeNow = new Date();
    console.log('%s %s %s %s %s', timeNow.toISOString(), req_ip, req.method, req.url, req.path);
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/users', user_1.default);
app.use('/climate', climate_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//# sourceMappingURL=app.js.map