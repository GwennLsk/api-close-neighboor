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

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.header('Access-Control-Expose-Headers', 'Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//     next();
// })

app.get('/', (req, res)=> {
    res.send("bonjour")
});
require('./routes/router')(app);
log();
// require('./lib/controllerLoader')(app);

module.exports = app;
