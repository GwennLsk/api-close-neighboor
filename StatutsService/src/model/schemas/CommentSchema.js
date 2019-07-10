let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let CommentSchema = new Schema({
    author: {
        type: ObjectId,
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
    }]
},{
    _id: false
});
CommentSchema.pre('save', function () {
    this.likes.forEach(like => like.service = 'statut');
    this.author.service = 'user'
});
module.exports = CommentSchema;
