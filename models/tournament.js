const mongoose = require('mongoose');

const { Schema } = mongoose;

const TournamentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    participantMode: { type: String },
    groupQualifiers: { type: Number },
}, { toJSON: { virtuals: true } });

TournamentSchema.virtual('groups', {
    ref: 'Group',
    localField: '_id',
    foreignField: 'tournament',
});

module.exports = mongoose.model('Tournament', TournamentSchema);
