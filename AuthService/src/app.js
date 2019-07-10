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

const getLoggerForStatusCode = (statusCode) => {
    if (statusCode >= 500) {
        return console.error.bind(console)
    }
    if (statusCode >= 400) {
        return console.warn.bind(console)
    }

    return console.log.bind(console)
}

const logRequestStart = (req, res, next) => {
    console.info(`${req.method} ${req.originalUrl}`)

    const cleanup = () => {
        res.removeListener('finish', logFn)
        res.removeListener('close', abortFn)
        res.removeListener('error', errorFn)
    }

    const logFn = () => {
        cleanup()
        const logger2 = getLoggerForStatusCode(res.statusCode)
        logger2(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
    }

    const abortFn = () => {
        cleanup()
        console.warn('Request aborted by the client')
    }

    const errorFn = err => {
        cleanup()
        console.error(`Request pipeline error: ${err}`)
    }

    res.on('finish', logFn) // successful pipeline (regardless of its response)
    res.on('close', abortFn) // aborted pipeline
    res.on('error', errorFn) // pipeline internal error

    next()
}

app.use(logRequestStart)


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
app.get('/', (req, res) => {
    res.send('AuthService open')
})
app.post('/login', controller.LogIn);
app.post('/signin', controller.SignIn);
app.get('/logout', controller.LogOut);

module.exports = app;
