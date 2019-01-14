const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let LectorSchema = new Schema({
    name: {type: String, required: true, max: 100},
    age: {type: Number, required: true}
}, {toJSON: {virtuals: true}});

LectorSchema.virtual('students', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'lector'
})

module.exports = mongoose.model('Lector', LectorSchema);