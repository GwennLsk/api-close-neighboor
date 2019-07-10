let conn = require('../messages/amqpConnect');
const { ObjectId } = require('mongodb');
let User = require('../model/User');
const _ = require('lodash');
const amqp = require('../messages/amqpConnect')


function createUser(msg) {
    return new Promise((resolve, reject) => {
        var body = _.pick(msg.body, ['name', 'firstname','email', 'password']);
        var user = new User(body);
        user.save().then(doc => {
            resolve(JSON.stringify(doc))
        }).catch(err => {
            reject(JSON.stringify(err))
        })
    })
}

function getUsers() {
    return new Promise((resolve, reject) => {
            User.find().then(users => {
                resolve(JSON.stringify(users))
            }).catch(err => {
                reject(JSON.stringify(err))
            })
    })
}
function getUser(msg) {
    return new Promise((resolve, reject) => {
        let id = msg.id;

        console.log(msg);
        if (!ObjectId.isValid(id)) {
            console.log('error')
            reject(`${id} is invalid`);
        }
        User.findById(id).then((user) => {
            resolve(JSON.stringify(user));
        }).catch((err) => {
            reject(JSON.stringify(err))
        })

    })
}

function getUserByProps(msg) {
    return new Promise((resolve, reject) => {
        User.find(msg.content).then(users => {
            if (users.length === 0)
                reject('does not match')
            resolve(users)
        }).catch(err => reject(err))
    })
}

function updateUser(msg) {
    return new Promise((resolve, reject) => {
        let id = msg.id;
        let body = _.pick(msg.body, [
            'name',
            'firstname',
            'email',
            'password',
            'address',
            'jobs',
            'birthdate',
            'pictures',
            'statuts',
            'annonces',
            'events',
            'friends',
            'commerces',
            'pages',
            'tokens'
        ]);
        User.findByIdAndUpdate(id, {$set: body}, {new: true}).then(user => {
            resolve(JSON.stringify(user))
        }).catch(err => {
            reject(JSON.stringify(err))
        })
    })
}

function deleteUser(msg) {
    return new Promise((resolve, reject) => {
        let id = msg.id;
        User.findByIdAndDelete(id).then( user =>
            resolve(JSON.stringify(user))
        ).catch(err => {
            reject(JSON.stringify(err))
        })
    })
}
//
// function send(ch, msg) {
//     ch.sendToQueue(msg.properties.replyTo,
//         Buffer.from(msg), {
//             correlationId: msg.properties.correlationId
//         });
// }

module.exports = {
    createUser,
    getUser,
    getUsers,
    getUserByProps,
    updateUser,
    deleteUser
};

