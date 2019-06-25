const _ = require('lodash');
let amqp = require('../messages/amqpConnect')
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')
let axios = require('axios');
let queryString = require('querystring')

let userUrl = 'http://localhost:3002/'

function SignIn(req, res) {
    console.log(req.body)
    var body = _.pick(req.body, ['name', 'firstname', 'email', 'password', 'address'])
    console.log(body);
    crypt(req.body.password).then(hash => {
        body.password = hash;
        console.log(body)
        axios.post(userUrl, body).then(resp => {
            res.send(resp.data)
        }).catch(err => {
            res.send(err)
        })
    });
}

function LogOut(req, res) {
    console.log(req.headers)
    let decoded = jwt.verify(req.headers['x-api-key'], 'devCN');
    axios.patch('http://localhost:3002/'+ decoded._id, {
        tokens: []
    }).then(resp => res.send(resp)).catch(err => res.send(err))
}

function LogIn(req, res) {
    console.log(queryString.stringify(req.query))
    axios.get('http://localhost:3002/find?'+ queryString.stringify(req.body) ).then( resp => {
        if (resp.data.user[0].password == req.body.password) {
            console.log('testtest');
            let access = 'auth';
            let token = jwt.sign({_id: resp.data.user[0]._id, access}, 'devCN').toString();
            resp.data.user[0].tokens.push({access, token});
            axios.patch('http://localhost:3002/'+ resp.data.user[0]._id, {
                tokens: resp.data.user[0].tokens
            }).then(resp2 => {
                res.send(resp2.data)
            })
        }
    })
}

function crypt(pwd) {
    return new Promise((resolve, reject) =>(
        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(pwd, salt, (err, hash) => {
                // console.log(hash)
                resolve(hash)
            })
        })
    ))
}

module.exports = {
    SignIn,
    LogIn,
    LogOut
}
