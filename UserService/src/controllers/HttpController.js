const User = require('../model/User');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
let emitter = require('../messages/emitter');

function createUser(req, res) {
    var body = _.pick(req.body, ['_id','name', 'firstname','email', 'password', "address"]);
    console.log('body : ')
    console.log( body)
    var user = new User(body);
    user.save().then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        console.log(err)
        res.status(400).send(err);
    })
}

function getUsers(req, res) {
    console.log("testest")
    User.find().then(users => {
        console.log(users)
        res.status(200).send({users});
    }).catch(err => {
        console.log(err)
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

function getUserByProps(req, res) {
    console.log(req.query);
    User.find(req.query).then(user => {
        if (!user)
            return res.status(404).send();
        console.log(user)
        res.status(200).send({user});
    }).catch(err => {
        res.status(400).send('Error: '+err);
    })
}

function updateUser(req, res) {
    let id = req.params.id;
    console.log(req.body)
    let body = _.pick(req.body, [
        'name',
        'firstname',
        'email',
        'password',
        'tokens',
        'address',
        'jobs',
        'birthdate',
    ]);
    let toPush= _.pick(req.body, [
        'pictures',
        'statuts',
        'annonces',
        'events',
        'friends',
        'commerces',
        'pages'
    ]);
    // console.log(req.body)
    console.log(Object.keys(toPush).length)

    if (!ObjectID.isValid(id))
        return res.status(400).send();

    let update;
    if (req.headers['options-remove']) {
        update = User.findByIdAndUpdate(id, {$pull: toPush}, {new: true})
    } else if (toPush) {
        console.log(toPush)
        update = User.findByIdAndUpdate(id, {$push: toPush}, {new: true})
    } else {
        update = User.findByIdAndUpdate(id, {$set: body}, {new: true})
    }
    update.then(user => {

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
    getUserByProps,
    getUsers,
    updateUser,
    deleteUser
};
