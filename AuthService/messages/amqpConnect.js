function bail(err) {
    console.error(err);
    process.exit(1);
}

// Publisher
function publisher(q, message) {
    connect((conn) => {
        conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(q);
            ch.sendToQueue(q, Buffer.from(message));
        }
    })
}

// Consumer
function consumer(q, callback) {
    connect((conn) => {
        var ok = conn.createChannel(on_open);
        function on_open(err, ch) {
            if (err != null) bail(err);
            ch.assertQueue(q);
            ch.consume(q, function(msg) {
                if (msg !== null) {
                    callback(msg);
                    console.log('test')
                    ch.ack(msg);
                }
            });
        }
    })
}

function connect(callback) {
    require('amqplib/callback_api')
        .connect('amqp://localhost', function(err, conn) {
            if (err != null) bail(err);
            callback(conn)
        });
}

function request(q, msg, callback) {
    consumer(`${q}_response`, (mess) => {
        console.log("amqpConnect, request().consumer()");
        console.log(callback.toString());
        callback(mess)
        console.log('end of callback');
    });
    publisher(`${q}_request`, JSON.stringify(msg))
}
function response(q, callback) {
    consumer(`${q}_request`, (msg) => {
        callback(msg).then( res => {
                publisher(`${q}_response`, res)
            }
        );
    })
}

module.exports = {
    consumer,
    publisher,
    request,
    response,
    connect
}
