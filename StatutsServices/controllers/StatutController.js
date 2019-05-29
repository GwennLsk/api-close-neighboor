const Statut = require('../model/Statut');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

function createStatut(req, res) {
    var body = _.pick(req.body, ['description', 'pictures']);
    var statut = new Statut(body);
    statut.save().then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(400).send(err);
    })
}

function getStatuts(req, res) {
    Statut.find().then(statuts => {
        res.status(200).send({statuts});
    }).catch(err => {
        res.status(400).send(err);
    })
}

function getStatut(req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Statut.findById(id).then(statut => {
        if (!statut)
            return res.status(404).send();
        res.status(200).send({statut});
    }).catch(err => {
        res.status(400).send(err);
    })
}

function updateStatut(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['description', 'pictures', 'likes', 'comments']);

    if (!ObjectID.isValid(id))
        return res.status(400).send();
    Statut.findByIdAndUpdate(id, {$set: body}, {new: true}).then(statut => {

        if (!statut) {
            return res.status(404).send();
        }
        res.status(200).send({statut});
    }).catch(err => res.status(400).send());
}

function deleteStatut(req, res) {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Statut.findByIdAndDelete(id).then(statut => {
        if (!statut)
            return res.status(404).send();
        res.status(200).send({statut});
    }).catch(err => res.status(400).send());
}

module.exports = {
    createStatut,
    getStatut,
    getStatuts,
    updateStatut,
    deleteStatut
};
