let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let validator = require('validator');
let JobSchema = require('./schemas/jobSchema');
let AddressSchema = require('./schemas/AddressSchema');
let emitter = require('../messages/emitter');

let UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    address: AddressSchema,
    email: {
        type: String,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Email Invalide"
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    birthdate: {
        type: Date,
    },
    jobs: [JobSchema],
    pictures: [{
        path: {
            type: String,
            required: true
        },
        isCover: {
            type: Boolean,
        },
        isProfile: {
            type: Boolean
        }
    }],
    statuts: [{
        type: ObjectId,
    }],
    annonce: [{
        type: ObjectId,
    }],
    evenement: [{
        type: ObjectId,
    }],
    friends: [{
        type: ObjectId,
        ref: 'User'
    }],
    commerces: [{
        type: ObjectId,
    }],
    pages: [{
        roles: [{
            type: String,
        }],
        page: {
            type: ObjectId,
        }
    }]
});
UserSchema.pre('save', function () {
    if(this.statuts) {
        this.statuts.forEach(statut => statut.service = 'statut');
    }
});
UserSchema.pre('find', function () {
    if (this.statuts) {
        this.statuts.forEach(statut => {
            emitter(statut.service, statut.link)
        })
    }
});
let User = mongoose.model('User', UserSchema);
module.exports = User;
