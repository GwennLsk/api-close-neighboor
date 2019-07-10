let context = require('rabbit.js').createContext('amqp://localhost')
module.exports = (model, method, callback) => {
    const pub = context.socket('PUB', {routing: 'direct'});
    const sub = context.socket('SUB', {routing: 'direct'})

    sub.connect(model, method, () => {
        sub.on('data', callback)
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

