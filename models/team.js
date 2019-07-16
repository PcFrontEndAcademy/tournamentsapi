const mongoose = require('mongoose');

const { Schema } = mongoose;

const TeanSchema = new Schema({
    name: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
});

module.exports = mongoose.model('Team', TeanSchema);
