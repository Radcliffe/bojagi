// JSHint directives
/*jslint node: true */


const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    edit = require('./routes/edit'),
    save = require('./routes/save'),
    show = require('./routes/show'),
    list = require('./routes/list'),
    about = require('./routes/about'),
    get = require('./routes/get'),
    app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB configuration
var mongojs = require('mongojs');
var db_name = 'bojagi';

//provide a sensible default for local development
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;

//take advantage of env vars when available:
if(process.env.MONGODB_DB_URL){
  mongodb_connection_string = process.env.MONGODB_DB_URL + db_name;
}

var db = mongojs(mongodb_connection_string, ['levels', 'counters']);

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/edit', edit);
app.use('/save', save);
app.use('/show', show);
app.use('/list', list);
app.use('/about', about);
app.use('/get', get);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Start the server
 
var debug = require('debug')('my-application');
// var app = require('../app');

app.set('port', process.env.NODEJS_PORT || 5000);
var ipaddress = process.env.NODEJS_IP || "0.0.0.0";

var server = app.listen(app.get('port'), ipaddress, function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
