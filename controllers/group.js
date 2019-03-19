const Group = require('../models/group');
const Tournament = require('../models/tournament');
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

exports.get = async function (request, response, next){
    try {
        const { tournamentid } = request.query;
        let groups = await Group.find({tournament: tournamentid})
        .sort('name')
        .populate('results.away')
        .populate('results.home')
        .populate('participants');

        const tournament = await Tournament.findById(tournamentid);
        let formedGroups = [];

        if (tournament) {
            for(let i = 0; i < groups.length; i++){
                const group = groups[i];
                let formedGroup = {
                    name: group.name,
                    _id: group._id,
                    participants: [],
                    results: group.results
                };
                formedGroup.participants = groupFormation[tournament.type](group);
                formedGroups.push(formedGroup);
            }
        }

        response.send(formedGroups);
    } catch(error) {
        next(boom.badData(error));
    }
}

exports.addparticipants = async function (request, response, next){
    try{
        let group = await Group.findOneAndUpdate({_id: request.body.id},
            {$set: { participants : request.body.participants}});
        response.send(group);
    }catch(error) {
        next(boom.badData(error));
    }
}

exports.addparticipant = async function (request, response, next){
    try{
        let group = await Group.findOneAndUpdate({_id: request.body.id},
            {$push: { participants : request.body.participant}});
        response.send(group);
    }catch(error) {
        next(boom.badData(error));
    }
}

exports.start = async function (request, response, next){
    try{
        const { tournamentid } = request.body;
        let groups = await Group.find({tournament: tournamentid})
            .sort('name')
            .populate('participants');

        for(let i = 0; i < groups.length; i++){
            let group = groups[i];
            let results = pair(group.participants);
            Group.findByIdAndUpdate(group.id, {$set:{results: results}}, function(error, doc){});
        }

        response.send(tournamentid);
    }catch(error) {
        next(boom.badData(error));
    }
}

const groupFormation = {
    Football: formFootbalGroup,
    TableTennis: formTableTennisGroup
}

function formFootbalGroup(group){
    let formedGroup = [];
    for(var i = 0; i < group.participants.length; i++){
        let participant = group.participants[i];
        let item = {
            _id: participant._id,
            name: participant.name,
            GP: 0,
            W: 0,
            D: 0,
            L: 0,
            GF: 0,
            GA: 0,
            GD: 0,
            PTS: 0
        };
        formedGroup.push(item);
    }
    return formedGroup;
}

function formTableTennisGroup(group){
    let formedGroup = [];
    for(var i = 0; i < group.participants.length; i++){
        let participant = group.participants[i];
        let item = {
            _id: participant._id,
            name: participant.name,
            GP: 0,
            W: 0,
            L: 0,
            SW: 0,
            SL: 0,
            SD: 0,
            PTS: 0
        };
        formedGroup.push(item);
    }
    return formedGroup;
}

function pair(array) {
    let result = [];
    for (let i = 0; i < array.length; i++){
        for(let j = i + 1; j < array.length; j++){
            result.push({
                home: array[i].id,
                away: array[j].id,
            });
        }
    }
    return result;
}