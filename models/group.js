const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let groupSchema = new Schema({
    name: {type: String, required: true},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', required: true},
    participants: [{type: Schema.Types.ObjectId, ref: 'Participant'}],
    results: {type: Array}
});

module.exports = mongoose.model('Group', groupSchema);