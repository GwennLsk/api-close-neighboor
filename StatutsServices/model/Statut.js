let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let CommentSchema = require('./schemas/CommentSchema');

let StatutSchema = new Schema({
    description: {
        type: String
    },
    pictures: [{
        path: {
            type: String
        }
    }],
    likes: [{
        link: {
            type: ObjectId,
        },
        service: {
            type: String,
            default: 'statut'
        }
    }],
    comments: [CommentSchema]

});
StatutSchema.pre('save', function () {
    this.likes.forEach(like => like.service = 'statut');
});
let Statut = mongoose.model('Statut', StatutSchema);

module.exports = Statut;
