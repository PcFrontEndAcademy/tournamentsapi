const boom = require('boom');
const Tournament = require('../models/tournament');
const Group = require('../models/group');

exports.create = async function create(request, response) {
    const tournament = new Tournament({
        name: request.body.name,
        type: request.body.type,
    });

    const result = await tournament.save();
    response.send(result);
};

exports.get = async function get(request, response) {
    const tournaments = await Tournament.find();
    response.send(tournaments);
};

exports.getOne = async function getOne(request, response) {
    const { id } = request.params;
    const tournament = await Tournament.findById(id).populate('groups', 'name');
    response.send(tournament);
};

exports.delete = async function deleteTournament(request, response) {
    const { id } = request.query;

    await Group.deleteMany({ tournament: id });
    await Tournament.findByIdAndDelete(id);
    response.send(true);
};

exports.updateSettings = async function updateSettings(request, response, next) {
    try {
        const { id, participantMode, groupQualifiers } = request.body;
        await Tournament.findByIdAndUpdate(id, { participantMode, groupQualifiers });
        response.send(true);
    } catch (error) {
        next(boom.badData(error));
    }
};
