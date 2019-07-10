let amqp = require('amqplib/callback_api');
let colors = require('colors');

let args = process.argv.slice(2);

function emit(model, id, callback) {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if(error1) throw error1;
            channel.assertQueue('', {
                exclusive: true
            }, (error2, q) => {
                if(error2) throw error2;

                let correlationId = generateUuid();
                var num = parseInt(args[0]);

                channel.consume(q.queue, (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        setTimeout(()=> {
                            callback(JSON.parse(msg.content.toString()));
                            connection.close();
                            process.exit(0);
                        }, 500);
                    }
                }, {
                    noAck: true
                });

                channel.sendToQueue(`${model}`,
                    Buffer.from(id.toString()),{
                        correlationId: correlationId,
                        replyTo: q.queue
                    })
            })
        })
    });
}
