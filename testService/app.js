var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let emitter = require('./messages/emitter');
let receiver = require('./messages/receiver');
let amqp = require('./messages/amqpConnect')


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello world')
});
app.get('/:id', (req, res) => {
   res.send('id='+req.params.id)
});

amqp.response('test', (msg) => {
    return `hello ${msg.content.toString()}`
});



module.exports = app;
