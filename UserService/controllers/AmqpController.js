let conn = require('../messages/amqpConnect');
const { ObjectID } = require('mongodb');
let User = require('../model/User');
const _ = require('lodash');
const emitter = require('../messages/emitter');

function createUser() {
    conn.channel.then((ex) => {
        conn.conn.then((ch) => {
            ch.assertQueue('', {exclusive: true}).then((q) => {
                ch.prefetch(1);
                ch.bindQueue(q.queue, conn.exchange, 'get_all');
                ch.consume(q.queue, function reply(msg) {
                    var body = _.pick(msg.content, ['name', 'firstname','email', 'password']);
                    var user = new User(body);
                    user.save().then(doc => {
                        send(ch, JSON.stringify(doc))
                    }).catch(err => {
                        send(ch, JSON.stringify(err))
                    }).finally(() => ch.ack(msg))
                })
            })
        })
    })
}function createUser() {
        var body = _.pick(msg.content, ['name', 'firstname','email', 'password']);
        var user = new User(body);
        user.save().then(doc => {
            send(ch, JSON.stringify(doc))
        }).catch(err => {
            send(ch, JSON.stringify(err))
        })
}
function getUsers() {
    conn.channel.then((ex) => {
        conn.conn.then((ch) => {
            ch.assertQueue('', {exclusive: true}).then((q) => {
                ch.prefetch(1);
                ch.bindQueue(q.queue, conn.exchange, 'get_all');
                ch.consume(q.queue, function reply(msg) {
                    User.find().then(users => {
                        send(ch, JSON.stringify(users))
                    }).catch(err => {
                        send(ch, JSON.stringify(err))
                    }).finally(() => ch.ack(msg))
                })
            })
        })
    })
}
function getUser() {
    conn.channel.then((ex) => {
        conn.conn.then((ch) => {
            ch.assertQueue('', {exclusive: true}).then((q) => {
                ch.prefetch(1);
                ch.bindQueue(q.queue, conn.exchange, 'get_one');
                ch.consume(q.queue, function reply(msg) {
                    let id = parseInt(msg.content.toString());
                    if (!ObjectID.isValid(id))
                        send(ch,`${id} is invalid`);
                    User.findById(id).then((user) => {
                        send(ch, `user not found`);
                        function callback() {
                            send(ch, JSON.stringify(user))
                        }
                        if (msg.properties.relations) {
                            if (user.statuts) {
                                let i = 0;
                                user.statuts.forEach((statut, index, array) => {
                                    emitter(statut.service, statut.link, (res) => {
                                        user.statuts[i] = res;
                                        i++;
                                        if (i === array.length) {
                                            callback()
                                        }
                                    });
                                });
                            }
                        }
                        else callback();
                    }).catch((err) => {
                        send(ch, JSON.stringify(user))
                    }).finally(() => ch.ack(msg))
                })
            })
        })
    })
}
function updateUser() {
    conn.channel.then((ex) => {
        conn.conn.then((ch) => {
            ch.assertQueue('', {exclusive: true}).then((q) => {
                ch.prefetch(1);
                ch.bindQueue(q.queue, conn.exchange, 'get_all');
                ch.consume(q.queue, function reply(msg) {
                    let id = msg.properties.id;
                    let body = _.pick(msg.content, [
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
                        'pages'
                    ]);
                    User.find().then(users => {
                        send(ch, JSON.stringify(users))

                    }).catch(err => {
                        send(ch, JSON.stringify(err))
                    }).finally(() => ch.ack(msg))
                })
            })
        })
    })
}
function deleteUser() {
    conn.channel.then((ex) => {
        conn.conn.then((ch) => {
            ch.assertQueue('', {exclusive: true}).then((q) => {
                ch.prefetch(1);
                ch.bindQueue(q.queue, conn.exchange, 'delete');
                ch.consume(q.queue, function reply(msg) {
                    let id = msg.properties.id;
                    User.findByIdAndDelete(id).then( user =>
                        send(ch, JSON.stringify(user))
                    ).catch(err => {
                        send(ch, JSON.stringify(err))
                    })
                })
            })
        })
    })
}

function send(ch, msg) {
    ch.sendToQueue(msg.properties.replyTo,
        Buffer.from(msg), {
            correlationId: msg.properties.correlationId
        });
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
};

