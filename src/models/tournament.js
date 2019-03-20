const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let TournamentSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true}
},
module.exports = mongoose.model('Tournament', TournamentSchema);