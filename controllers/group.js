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
    let groups = await Group.find();
    response.send(groups);
}