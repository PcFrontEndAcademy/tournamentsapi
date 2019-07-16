const boom = require('boom');
const Participant = require('../models/participant');
const Team = require('../models/team');
const Group = require('../models/group');
const Tournament = require('../models/tournament');
const participantModes = require('../enums/participantModes');

exports.create = async function create(request, response, next) {
    try {
        const participant = new Participant({
            name: request.body.name,
        });

        const result = await participant.save();
        response.send(result);
    } catch (error) {
        next(boom.badData(error));
    }
};

exports.get = async function get(_request, response) {
    const participants = await Participant.find()/* .populate('participant') */;
    response.send(participants);
};

exports.getUnusedInTournament = async function getUnusedInTournament(request, response, next) {
    try {
        const { tournamentid } = request.query;
        const tournament = await Tournament.findById(tournamentid);

        const groups = await Group.find({ tournament: tournamentid });
        let participants;

        if (tournament.participantMode === participantModes.single) {
            participants = await Participant.find();
        } else {
            participants = await Team.find();
        }

        participants = participants.filter((participant) => {
            const usedParticipant = groups.filter(
                group => group.participants.indexOf(participant._id) > -1,
            )[0];

            return usedParticipant == null;
        });

        response.send(participants);
    } catch (error) {
        next(boom.badData(error));
    }
};
