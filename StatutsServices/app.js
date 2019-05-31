const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const controller = require('./controllers/StatutController');
const debug = require('debug')('StatutService: server');
const receiver = require('./messages/receiver');


const app = express();

mongoose.connect( "mongodb://localhost:27017/close-neighboor", { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    debug('Connected to mongo !');
});

receiver();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/', controller.createStatut);
app.get('/', controller.getStatuts);
app.get('/:id', controller.getStatut);
app.put('/:id', controller.updateStatut);
app.delete('/:id', controller.deleteStatut);

module.exports = app;
