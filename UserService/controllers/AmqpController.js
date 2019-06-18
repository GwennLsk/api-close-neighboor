let conn = require('../messages/amqpConnect');
const { ObjectID } = require('mongodb');
let User = require('../model/User');

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
                        ch.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(doc), {
                                correlationID: msg.properties.correlationId
                            }));
                    }).catch(err => {
                        ch.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(err)), {
                                correlationId: msg.properties.correlationId
                            });
                    }).finally(() => ch.ack(msg))
                })
            })
        })
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
                        ch.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(users)), {
                                correlationId: msg.properties.correlationId
                            });
                    }).catch(err => {
                        ch.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(err)), {
                                correlationId: msg.properties.correlationId
                            });
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
                        ch.sendToQueue(msg.properties.replyTo, `${id} is invalid`);
                    User.findById(id).then((user) => {
                        if(!user) ch.sendToQueue(msg.properties.replyTo, `user not found`)
                        function callback() {
                            ch.sendToQueue(msg.properties.replyTo,
                                Buffer.from(JSON.stringify(user)), {
                                correlationId: msg.properties.correlationId
                                });
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
                        ch.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(err)), {
                                correlationId: msg.properties.correlationId
                            });
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
                        ch.sendToQueue(msg.properties.replyTo, users);

                    }).catch(err => {
                        ch.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(err)), {
                                correlationId: msg.properties.correlationId
                            });
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
            })
        })
    })
}

module.exports = getUser;

