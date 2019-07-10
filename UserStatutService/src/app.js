let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let controller = require('./controller/LinkController')

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/statut/:id', controller.GetStatutWithUser);
app.get('/user/:id', controller.GetUserWithStatut );
app.post('/', controller.postStatut);
app.delete('/:id', controller.deleteStatut)
app.patch('/:id', controller.updateStatut);

module.exports = app;
