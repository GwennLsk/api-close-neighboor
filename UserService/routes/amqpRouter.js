const amqp = require('../messages/amqpConnect');
const user = require('../controllers/AmqpController')
module.exports = amqp.response('user', (msg) => {
    return new Promise((resolve, reject) => {
        let content = JSON.parse(msg.content.toString());
        let res;
        switch (content.method) {
            case 'get_all':
                res = user.getUsers().then(users => resolve(users));
                break;
            default:
                res = 'please define which method to use'
        }

    })
})
