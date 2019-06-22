let amqp = require('amqplib/callback_api');
let context = require('rabbit.js').createContext('amqp://localhost');
let colors = require('colors')

module.exports = function (model, method, content) {
    let object = 'test';
    const pub = context.socket('PUBLISH', {routing: 'direct'});
    const sub = context.socket('SUBSCRIBE', { routing: 'direct'});

    sub.connect(model, method, () => {
        pub.connect(model, () => {
            pub.publish(method, JSON.stringify(content))
        })
    })

    // amqp.connect('amqp://localhost', function (error0, connection) {
    //     if (error0) {
    //         throw error0;
    //     }
    //     connection.createChannel((error1, channel) => {
    //         if(error1) throw error1;
    //         channel.assertQueue('', {
    //             exclusive: true
    //         }, (error2, q) => {
    //             if(error2) throw error2;
    //
    //             let correlationId = generateUuid();
    //             var num = parseInt(args[0]);
    //
    //
    //              channel.consume(q.queue, (msg) => {
    //                 if (msg.properties.correlationId === correlationId) {
    //                     callback(JSON.parse(msg.content.toString()));
    //                     setTimeout(()=> {
    //                         connection.close();
    //                     }, 500);
    //                 }
    //             }, {
    //                 noAck: true
    //             });
    //
    //             channel.sendToQueue(`${model}`,
    //                 Buffer.from(id.toString()),{
    //                     correlationId: correlationId,
    //                     replyTo: q.queue
    //                 })
    //         })
    //     })
    // });
};
function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
