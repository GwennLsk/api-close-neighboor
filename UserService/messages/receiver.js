let amqp = require('amqplib/callback_api');
let User = require('../model/User')
module.exports = (operation) => {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) throw error1;
            let queue = 'user';

            channel.assertQueue(queue, {
                durable: false
            });
            channel.prefetch(1);
            channel.consume(queue, function reply(msg){
                let id = parseInt(msg.content.toString());
                User.findById(id)
                    .then(user => {
                        console.log(user);
                        channel.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(user)), {
                                correlationId: msg.properties.correlationId
                            });
                        channel.ack(msg);
                    });
            })
        })
    });
}

