const amqp = require('../messages/amqpConnect');
const user = require('../controllers/AmqpController')
module.exports = function () {
    amqp.response('user', (msg) => {
        return new Promise((resolve, reject) => {
            let content = JSON.parse(msg.content.toString());
            switch (content.method) {
                case 'create':
                    user.createUser().then(doc => resolve(doc));
                    break;
                case 'get_all':
                    user.getUsers().then(users => resolve(users));
                    break;
                case 'get_one':
                    user.getUser(content.message).then(user => {
                        console.log('success')
                        resolve(user)
                    }).catch(err => {
                        console.error('y a err')
                        reject(err)
                    });
                    break;
                case 'get_by_props':
                    user.getUserByProps(content.message).then(users => {
                        resolve(users)
                    });
                    break;
                case 'update':
                    user.updateUser(content.message).then(user => resolve(user));
                    break;
                case 'delete':
                    user.deleteUser(content.message).then(user => resolve(user));
                    break;
                default:
                    reject('please define which method to use')
            }

        })
    })
};
