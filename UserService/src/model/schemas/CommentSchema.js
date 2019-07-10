let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AddressSchema = new Schema({
    author: {
      type: ObjectId,
      ref: 'User'
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
            ref: 'User'
        }
    }]
},{
    _id: false
});

module.exports = AddressSchema;
