const boom = require('boom');
const Team = require('../models/team');

exports.create = async function create(request, response, next) {
    try {
        const team = new Team(request.body);

        const result = await team.save();
        response.send(result);
    } catch (error) {
        next(boom.badData(error));
    }
};

exports.get = async function get(_request, response) {
    const teams = await Team.find();
    response.send(teams);
};
