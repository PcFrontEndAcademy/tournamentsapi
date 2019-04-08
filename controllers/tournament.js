const Tournament = require('../models/tournament');

exports.create = async function(request, response){
    let tournament = new Tournament({
        name: request.body.name,
        type: request.body.type
    });

    let result = await tournament.save();
    response.send(result);
}

exports.get = async function (request, response){
    let tournaments = await Tournament.find();
    response.send(tournaments);
}

exports.getOne = async function (request, response){
    const { id } = request.query;
    let tournament = await Tournament.findById(id);
    response.send(tournament);
}