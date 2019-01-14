const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let StudentSchema = new Schema({
    name: {type: String, required: true, max: 100},
    age: {type: Number, required: true},
    lector: {type: Schema.Types.ObjectId, ref: 'Lector', required: true}
});

module.exports = mongoose.model('Student', StudentSchema);