const User = require('../model/User');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
let emitter = require('../messages/emitter');


function SignIn(req, res) {
    var body = _.pick(req.body, ['name', 'firstname', 'email', 'password', 'address'])

}
function LogIn(req, res) {

}

module.exports = {
    SignIn,
    LogIn
}
