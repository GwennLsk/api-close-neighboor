let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let JobSchema = new Schema({
    poste: {
        type: String,
    },
    entreprise: new Schema({
        name: {
            type: String,
            required: true
        }
    }, {
        discriminatorKey: 'type',
        _id: false
    })
}, {
    _id: false
});

let Page = JobSchema.path('entreprise').discriminator('Page', new Schema({
    link: {
        type: ObjectId,
        ref: 'Page'
    }
},{
    _id: false
}));

let Market = JobSchema.path('entreprise').discriminator('Market', new Schema({
    link: {
        type: ObjectId,
        ref: 'Market'
    }
},{
    _id: false
}));

module.exports = JobSchema;
