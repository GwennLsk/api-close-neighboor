const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const controller = require('./controllers/HttpController');
const debug = require('debug')('UserService: server');
const amqp = require('./controllers/AmqpController');


const app = express();

mongoose.connect( "mongodb://localhost:27017/close-neighboor", { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    debug('Connected to mongo !');
});

amqp.createUser();
amqp.getUser();
amqp.updateUser();
amqp.getUsers();
amqp.createUser();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', controller.getUsers);
app.post('/', controller.createUser);
app.get('/:id', controller.getUser);
app.put('/:id', controller.updateUser);
app.delete('/:id', controller.deleteUser);

module.exports = app;
