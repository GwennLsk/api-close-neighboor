var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log = require('./services/serviceRegister');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=> {
    res.send("bonjour")
});
require('./routes/router')(app);
log();
// require('./lib/controllerLoader')(app);

module.exports = app;
