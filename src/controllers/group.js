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
		// Get
        const { tournamentid } = request.query;
        let groups = await Group.find({tournament: tournamentid})
        .sort('name')
        .populate('results.away')
        .populate('results.home')
        .populate('participants');

        const tournament = await Tournament.findById(tournamentid);
		
		// Build groups
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
		// split to two parameters
        let group = await Group.findOneAndUpdate({_id: request.body.id},
            {$set: { participants : request.body.participants}});
        response.send(group);
    }catch(error) {
        next(boom.badData(error));
    }
}

exports.addparticipant = async function (request, response, next){
    try{
		// split to two parameters
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
		
		// Get
        let groups = await Group.find({tournament: tournamentid})
            .sort('name')
            .populate('participants');

	    // BuildOponentPairs
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

exports.addResult = async function (request, response, next){
    try{
        const { homeScore, awayScore, groupId, resultId } = request.body;
		let group = await Group.findById(groupId);
		
		// Popoulate result
        for(let i = 0; i < group.results.length; i++){
            let result = group.results[i];
            if(result.id == resultId){
                result.homeScore = homeScore;
                result.awayScore = awayScore;
				break;
            }
        }

        await Group.findByIdAndUpdate(groupId, {$set:{results: group.results}});

        response.send(group);
    }catch(error) {
        next(boom.badData(error));
    }
}


// Move outside all that is downwards
const groupFormation = {
    Football: formFootbalGroup,
    TableTennis: formTableTennisGroup
}

// Build
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

        let gamesPlayed = 0;
        let wins = 0;
        let loses = 0;
        let setsWin = 0;
        let setsLost = 0;
        for(let i = 0; i < group.results.length; i++){
            const result = group.results[i];
            const isParticipantPlayed = result.awayScore != null && result.homeScore != null
            && (result.home.id == participant.id || result.away.id == participant.id);

            if(isParticipantPlayed){
                gamesPlayed += 1;
                if(result.home.id == participant.id){
                    setsWin += result.homeScore;
                    setsLost += result.awayScore;
                    if(result.homeScore > result.awayScore){
                        wins += 1;
                    }else if (result.homeScore < result.awayScore){
                        loses += 1;
                    }
                }else{
                    setsWin += result.awayScore;
                    setsLost += result.homeScore;
                    if(result.awayScore > result.homeScore){
                        wins += 1;
                    }else if (result.awayScore < result.homeScore){
                        loses += 1;
                    }
                }
            }
        }

        let item = {
            _id: participant._id,
            name: participant.name,
            GP: gamesPlayed,
            W: wins,
            L: loses,
            SW: setsWin,
            SL: setsLost,
            SD: setsWin - setsLost,
            PTS: wins
        };
        formedGroup.push(item);
    }

    formedGroup.sort(compare);
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

function compare(a,b) {
    const aScore = a.W * 1000 + a.SD
    const bScore = b.W * 1000 + b.SD
    if (aScore < bScore)
      return 1;
    if (aScore > bScore)
      return -1;
    return 0;
  }