const Group = require('../models/group');
const boom = require('boom');

exports.create = async function(request, response, next){
    try{
        let group = new Group({
            name: request.body.name,
            tournament: request.body.tournament
        });
    
        let result = await group.save();
        response.send(result);

    } catch(error) {
        next(boom.badData(error));
    }
}

exports.get = async function (request, response){
    let groups = await Group.find().populate('participants');
    response.send(groups);
}

exports.addparticipants = async function (request, response, next){
    try{
        let group = await Group.findOneAndUpdate({_id: request.body.id},
            {$set: { "participants" : request.body.participants}});
        response.send(group);
    }catch(error) {
        next(boom.badData(error));
    }
}