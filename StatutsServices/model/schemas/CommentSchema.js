let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let CommentSchema = new Schema({
    author: {
        link: {
            type: ObjectId,
        },
        service: {
            type: String,
            default: 'user'
        }
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
        link: {
            type: ObjectId,
        },
        service: {
            type: String,
            default: 'statut'
        }
    }]
},{
    _id: false
});
CommentSchema.pre('save', function () {
    this.likes.forEach(like => like.service = 'statut');
    this.author.service = 'user'
});
module.exports = CommentSchema;
