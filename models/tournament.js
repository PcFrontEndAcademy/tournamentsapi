const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let TournamentSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true}
}, {toJSON: {virtuals: true}});

TournamentSchema.virtual('groups', {
    ref: 'Group',
    localField: '_id',
    foreignField: 'tournament'
})

module.exports = mongoose.model('Tournament', TournamentSchema);