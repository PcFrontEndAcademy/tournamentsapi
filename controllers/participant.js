const Participant = require('../models/participant');
const Team = require('../models/team');
const Group = require('../models/group');
const Tournament = require('../models/tournament');
const boom = require('boom');
const participantModes = require('../enums/participantModes');

exports.create = async function(request, response, next){
    try{
        let participant = new Participant({
            name: request.body.name
        });
    
        let result = await participant.save();
        response.send(result);

    } catch(error) {
        next(boom.badData(error));
    }
}

exports.get = async function (request, response){
    let participants = await Participant.find()/*.populate('participant')*/;
    response.send(participants);
}

exports.getUnusedInTournament = async function(request, response, next){
    try{
        const {tournamentid} = request.query;
        const tournament = await Tournament.findById(tournamentid);

        const groups = await Group.find({tournament: tournamentid});
        let participants;
        
        if(tournament.participantMode === participantModes.single){
            participants = await Participant.find();
        }else{
            participants = await Team.find();
        }

        participants = participants.filter((participant)=> {
            const usedParticipant = groups.filter((group)=> {
                return group.participants.indexOf(participant._id) > -1;
            })[0];

            return usedParticipant == null;
        });
        
        response.send(participants);

    } catch(error) {
        next(boom.badData(error));
    }
}