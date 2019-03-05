const Participant = require('../models/participant');
const boom = require('boom');

exports.create = async function(request, response, next){
    try{
        let tournament = new Participant({
            name: request.body.name,
            tournament: request.body.tournament
        });
    
        let result = await tournament.save();
        response.send(result);

    } catch(error) {
        next(boom.badData(error));
    }
}

exports.get = async function (request, response){
    let participants = await Participant.find()/*.populate('participant')*/;
    response.send(participants);
}