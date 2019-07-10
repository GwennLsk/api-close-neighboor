let axios = require('axios');
let register = require('../config/MicroServicesRegister');
let _ = require('lodash');
let jwt = require('jsonwebtoken')

function GetUserWithStatut(req, res) {
    axios.get(register.user.url + '/' + req.params.id).then(resp => {
        console.log(resp.data)
        resp.data.user.statuts.forEach(statut => {
            axios.get(register.statuts.url + '/' + statut).then(resp2 => {
                user.statuts[statut] = resp2.data;
            })
        })
        res.send(resp.data.user)
    })
}

function GetStatutWithUser(req, res) {
    axios.get(register.statuts.url+ '/' + req.params.id).then(resp => {
        console.log(resp.data)
        axios.get(register.user.url + '/' + resp.data.statut.author).then( resp2 => {
            console.log(resp2.data)
            resp.data.author = resp2.data.user
            res.send(resp.data)
        })
    })
}

function postStatut(req, res) {
    console.log(req.headers)
    let body = _.pick(req.body, ['description', 'pictures']);
    let token = jwt.verify(req.headers['x-api-key'], 'devCN');
    body.author = token._id;
    axios.post(register.statuts.url, body).then(statut => {
        // console.log(token)
        console.log(statut.data);
        axios.patch(register.user.url + '/' + token._id, {
            statuts: statut.data._id
        }).then(user => {
            statut.data.author = user.data.user
            res.send(statut.data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    })
}

//TODO déplacer dans StatutFrontService
function updateStatut(req,res) {
    let body = {}
    let token = jwt.verify(req.headers['x-api-key'], 'devCN');
    if (req.body.user.user._id === token._id) {
        body = _.pick(req.body, ['description', 'pictures', 'likes', 'comments'])
    } else {
        body = _.pick(req.body, ['likes', 'comments'])
    }
    if (body.like) body.like = token._id;
    if (body.comments) body.comments.author = token._id
    axios.patch(register.statuts.url, body).then(statut => {
        res.send(statut.data)
    }).catch(err => res.send(err))
}

function deleteStatut(req, res) {

    axios.get(register.statuts.url + '/' + req.params.id).then( resp => {
        console.log(resp.data)
        axios.delete(register.statuts.url + '/' + req.params.id).then( resp2 => {
            axios.patch(register.user.url + '/' + resp.data.statut.author, {
                headers: {
                    "options-remove": true
                }
            }, req.body).then(resp3 => {
                res.send(resp3.data)
            })
        })
    })
}

module.exports = {
    GetUserWithStatut,
    GetStatutWithUser,
    postStatut,
    updateStatut,
    deleteStatut
}
