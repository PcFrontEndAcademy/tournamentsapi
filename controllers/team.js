const Team = require('../models/team');
const boom = require('boom');

exports.create = async function(request, response, next){
    try{
        let team = new Team(request.body);
    
        let result = await team.save();
        response.send(result);

    } catch(error) {
        next(boom.badData(error));
    }
}

exports.get = async function (request, response){
    let teams = await Team.find();
    response.send(teams);
}