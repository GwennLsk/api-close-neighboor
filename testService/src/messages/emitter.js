let context = require('rabbit.js').createContext('amqp://localhost');

module.exports = function (model, method, content) {
    let object = 'test';
    const pub = context.socket('PUBLISH', {routing: 'direct'});
    const sub = context.socket('SUBSCRIBE', { routing: 'direct'});

    sub.connect(model, method, () => {
        pub.connect(model, () => {
            pub.publish(method, JSON.stringify(content));
            context.close()
        })
    })

    // Example of using rabbit.js as an easy version of AMQP. Not
// interactive: just fires lots of messages at RabbitMQ, consumes
// them, and reports on the results.

    var ctx = require('../../index').createContext();

    ctx.on('ready', function() {

        var running = true;
        var pub = ctx.socket('PUB');
        var sub = ctx.socket('SUB');

        var now = process.hrtime(), since = now;
        var i = 0, j = 0;
        var lasti = 0, lastj = 0;

        function report() {
            var elapsed = process.hrtime(since);
            since = process.hrtime();
            var secs = elapsed[0] + elapsed[1] * Math.pow(10, -9);
            var sent = j - lastj, recv = i - lasti;
            lasti = i; lastj = j;
            console.log('Sent: %d at %d msg/s, Recv: %d at %d msg/s',
                sent, (sent / secs).toFixed(1),
                recv, (recv / secs).toFixed(1));
        }

        function finish() {
            running = false;
            var since = process.hrtime(now);
            report();
            ctx.close();
        }
        process.on('SIGINT', finish);

        sub.connect('easyamqp', function() {
            console.log("Starting consumer...");

            function recv() {
                while(sub.read()) {
                    i++;
                }
            }
            sub.on('readable', recv);

            pub.connect('easyamqp', function() {
                console.log("Starting publisher...");

                var writable = true;
                function send() {
                    while (running && (writable = pub.write('foobar'))) {
                        j++;
                        if (j % 5000 === 0) {
                            report();
                            break; // give recv a chance
                        }
                    }
                    if (running && writable) setImmediate(send);
                    else {
                        //console.log('Waiting for drain at %d', j);
                    }
                }
                pub.on('drain', send);
                send();
            });

        });

    });
    ctx.on('error', console.warn);

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
