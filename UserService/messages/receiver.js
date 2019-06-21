let amqp = require('amqplib/callback_api');
let User = require('../model/User');
let context = require('rabbit.js').createContext('amqp://localhost')
module.exports = (operation) => {
    let object = 'test';
    const pub = context.socket('PUBLISH', {routing: 'direct'});
    const sub = context.socket('SUBSCRIBE', { routing: 'direct'});

    sub.connect(model, '*', () => {
        pub.connect(model, () => {
            pub.read(method, JSON.stringify(content))
        })
    })
    // amqp.connect('amqp://localhost', function (error0, connection) {
    //     if (error0) {
    //         throw error0;
    //     }
    //     connection.createChannel((error1, channel) => {
    //         if (error1) throw error1;
    //         let queue = 'user';
    //
    //         channel.assertQueue(queue, {
    //             durable: false
    //         });
    //         channel.prefetch(1);
    //         channel.consume(queue, function reply(msg){
    //             let id = parseInt(msg.content.toString());
    //             User.findById(id)
    //                 .then(user => {
    //                     console.log(user);
    //                     channel.sendToQueue(msg.properties.replyTo,
    //                         Buffer.from(JSON.stringify(user)), {
    //                             correlationId: msg.properties.correlationId
    //                         });
    //                     channel.ack(msg);
    //                 });
    //         })
    //     })
    // });
}

