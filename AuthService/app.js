var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let amqp = require('./messages/amqpConnect');
let controller = require('./controller/AuthController')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res)=> {
//     amqp.request('test', 'gwenn', (msg) => {
//         res.send(msg.content.toString())
//     })
// })
// app.get('/list', (req, res) => {
//     amqp.request('user', {
//         method: 'get_all'
//     }, (msg) => {
//         console.log('received')
//         res.send(msg.content.toString())
//     })
// })
// app.get('/:id', (req, res) => {
//     amqp.request('user', {
//         method: 'get_one',
//         message: {
//             id: req.params.id
//         }
//     }, (msg) => {
//         res.send(msg.content.toString())
//     })
// })
app.get('/logout', controller.LogOut);
app.post('/login', controller.LogIn);
app.post('/signin', controller.SignIn);

module.exports = app;
