var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log = require('./services/serviceRegister');
let cors = require('cors');
const router = require('./routes/router');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Create global app objects
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'REST API for my App', // Title of the documentation
        version: '1.0.0', // Version of the app
        description: 'This is the REST API for my product', // short description of the app
    },
    host: 'localhost:3000', // the host or url of the app
    basePath: '/', // the basepath of your endpoint
};

// options for the swagger docs
const options = {
    swaggerDefinition,
    apis: ['apiGateway/src/docs/*.yaml'],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
console.log(swaggerSpec);

// use swagger-Ui-express for your app documentation endpoint
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// app.use(cors)
router(app)
log();

module.exports = app;
