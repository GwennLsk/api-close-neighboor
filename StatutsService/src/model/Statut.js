let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let CommentSchema = require('./schemas/CommentSchema');

let StatutSchema = new Schema({
    author: {
        type: ObjectId
    },
    description: {
        type: String
    },
    pictures: [{
        path: {
            type: String
        }
    }],
    likes: [{
            type: ObjectId,
    }],
    comments: [CommentSchema]

});
let Statut = mongoose.model('Statut', StatutSchema);

module.exports = Statut;
