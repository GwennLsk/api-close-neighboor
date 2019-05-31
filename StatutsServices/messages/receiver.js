let amqp = require('amqplib/callback_api');
let Statut = require('../model/Statut');
module.exports = () => {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) throw error1;
            let queue = 'statuts';

            channel.assertQueue(queue, {
                durable: false
            });
            channel.prefetch(1);
            channel.consume(queue, function reply(msg){
                let id = msg.content.toString();
                Statut.findById(id)
                    .then(statut => {
                       console.log(statut);
                        channel.sendToQueue(msg.properties.replyTo,
                            Buffer.from(JSON.stringify(statut)), {
                                correlationId: msg.properties.correlationId
                            });
                        channel.ack(msg);
                    });
            })
        })
    });
};

