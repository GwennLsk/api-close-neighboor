var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let amqp = require('./messages/amqpConnect');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=> {
    amqp.request('test', 'gwenn', (msg) => {
        res.send(msg.content.toString())
    })
})
app.get('/list', (req, res) => {
    amqp.request('user', {
        method: 'get_all'
    }, (msg) => {
        res.send(msg.content.toString())
    })
})

module.exports = app;
