const amqp = require('amqplib');

let exchange = 'user';
let open = amqp.connect('amqp://localhost');
let conn = open.then((connection) => {
    console.log('connected to server');
    return connection.createChannel()
}).catch((err) => console.error(err));
let channel = conn.then((ch) => {
    console.log('exchanger asserted')
    return ch.assertExchange(exchange, 'direct', {
        durable: false
    });
});

module.exports = {
    exchange,
    open,
    conn,
    channel
}
