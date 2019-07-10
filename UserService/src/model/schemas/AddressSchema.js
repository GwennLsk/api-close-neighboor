let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AddressSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    rue: {
        type: String,
        required: true,
    },
    codePostal: {
        type: String,
        required: true
    },
    ville: {
        type: String,
        required: true
    },
    complement: {
        etage: {
            type: Number
        },
        appartement: {
            type: Number
        },
        divers: {
            type: String
        }
    }
},{
    _id: false
});

module.exports = AddressSchema;
