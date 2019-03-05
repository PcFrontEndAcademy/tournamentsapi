const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ParticipantSchema = new Schema({
    name: {type: String, required: true},
    tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', required: true}
});

module.exports = mongoose.model('Participant', ParticipantSchema);