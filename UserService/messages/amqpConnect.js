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
            ch.sendToQueue(q, Buffer.from(JSON.stringify(message)));
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
        callback(mess)
    });
    publisher(`${q}_request`, JSON.stringify(msg))
}
function response(q, callback) {
    consumer(`${q}_request`, (msg) => {
        callback(msg).then( mess => {
                publisher(`${q}_response`, mess)
            }
        ).catch(err => console.error(err));
    })
}

module.exports = {
    consumer,
    publisher,
    request,
    response
}
