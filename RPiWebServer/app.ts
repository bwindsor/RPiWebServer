require('dotenv').config({ path: './process.env' });
import express = require('express');
import path = require('path');

import routes from './routes/index';
import users from './routes/user';
import climate from './routes/climate';

// Keep alive message, log every 5 minutes that app is running
setInterval( () => { var d = new Date(); console.log(d.toISOString() + " App is running") }, 300000);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/climate', climate);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err: any = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

export { app };
