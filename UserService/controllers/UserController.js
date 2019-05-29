const User = require('../model/User');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
let emitter = require('../messages/emitter');

function createUser(req, res) {
    var body = _.pick(req.body, ['name', 'firstname','email', 'password']);
    var user = new User(body);
    user.save().then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(400).send(err);
    })
}

function getUsers(req, res) {
    User.find().then(users => {
        res.status(200).send({users});
    }).catch(err => {
        res.status(400).send('error: '+err);
    })
}

function getUser(req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    User.findById(id).then(user => {
        if (!user)
            return res.status(404).send();
        function callback() {
            res.status(200).send({user});
        }
        if (req.get('options-withrelations') === 'true' ) {
            if (user.statuts) {
                let i = 0;
                user.statuts.forEach((statut, index, array) => {
                    emitter(statut.service, statut.link, (res) => {
                        user.statuts[i] = res;
                        i++;
                        if (i === array.length) {
                            callback()
                        }
                    });
                });
            }
        }else {
            callback()
        }
    }).catch(err => {
        res.status(400).send('Error: '+err);
    })
}

function updateUser(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, [
        'name',
        'firstname',
        'email',
        'password',
        'address',
        'jobs',
        'birthdate',
        'pictures',
        'statuts',
        'annonces',
        'events',
        'friends',
        'commerces',
        'pages'
    ]);

    if (!ObjectID.isValid(id))
        return res.status(400).send();
    User.findByIdAndUpdate(id, {$set: body}, {new: true}).then(user => {

        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send({user});
    }).catch(err => res.status(400).send());
}

function deleteUser(req, res) {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    User.findByIdAndDelete(id).then(user => {
        if (!user)
            return res.status(404).send();
        res.status(200).send({user});
    }).catch(err => res.status(400).send());
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
};
