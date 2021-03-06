const boom = require('boom');
const Group = require('../models/group');
const Tournament = require('../models/tournament');
const Participant = require('../models/participant');
const Team = require('../models/team');
const participantModes = require('../enums/participantModes');
const mathHelpers = require('../helpers/math');

exports.create = async function create(request, response, next) {
    try {
        const { tournament, groupsCount } = request.body;
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => c.toUpperCase());

        const savedGroups = [];
        for (let i = 0; i < groupsCount; i++) {
            const group = new Group({
                name: alphabet[i],
                tournament,
            });
            savedGroups.push(group.save());
        }

        await Promise.all(savedGroups);

        response.send(true);
    } catch (error) {
        next(boom.badData(error));
    }
};

function formFootbalGroup(group) {
    const formedGroup = [];
    for (let i = 0; i < group.participants.length; i++) {
        const participant = group.participants[i];
        const item = {
            _id: participant._id,
            name: participant.name,
            GP: 0,
            W: 0,
            D: 0,
            L: 0,
            GF: 0,
            GA: 0,
            GD: 0,
            PTS: 0,
        };
        formedGroup.push(item);
    }
    return formedGroup;
}

function compare(a, b) {
    const aScore = a.W * 1000 + a.SD;
    const bScore = b.W * 1000 + b.SD;
    if (aScore < bScore) { return 1; }
    if (aScore > bScore) { return -1; }
    return 0;
}

function formTableTennisGroup(group) {
    const formedGroup = [];
    for (let i = 0; i < group.participants.length; i++) {
        const participant = group.participants[i];

        let gamesPlayed = 0;
        let wins = 0;
        let loses = 0;
        let setsWin = 0;
        let setsLost = 0;
        for (let j = 0; j < group.results.length; j++) {
            const result = group.results[j];
            const isParticipantPlayed = result.awayScore != null && result.homeScore != null
            && (result.home.id === participant.id || result.away.id === participant.id);

            if (isParticipantPlayed) {
                gamesPlayed += 1;
                if (result.home.id === participant.id) {
                    setsWin += result.homeScore;
                    setsLost += result.awayScore;
                    if (result.homeScore > result.awayScore) {
                        wins += 1;
                    } else if (result.homeScore < result.awayScore) {
                        loses += 1;
                    }
                } else {
                    setsWin += result.awayScore;
                    setsLost += result.homeScore;
                    if (result.awayScore > result.homeScore) {
                        wins += 1;
                    } else if (result.awayScore < result.homeScore) {
                        loses += 1;
                    }
                }
            }
        }

        const item = {
            _id: participant._id,
            name: participant.name,
            GP: gamesPlayed,
            W: wins,
            L: loses,
            SW: setsWin,
            SL: setsLost,
            SD: setsWin - setsLost,
            PTS: wins,
        };
        formedGroup.push(item);
    }

    formedGroup.sort(compare);
    return formedGroup;
}

const groupFormation = {
    Football: formFootbalGroup,
    TableTennis: formTableTennisGroup,
};

exports.get = async function get(request, response, next) {
    try {
        const { tournamentid } = request.query;
        const tournament = await Tournament.findById(tournamentid);

        const model = tournament.participantMode === participantModes.single ? Participant : Team;

        const groups = await Group.find({ tournament: tournamentid })
            .sort('name')
            .populate({ path: 'results.away', model })
            .populate({ path: 'results.home', model })
            .populate({ path: 'participants', model });

        const closestBracket = mathHelpers.nearestPowerOf2(tournament.groupQualifiers);
        const primaryQualifiers = closestBracket - (tournament.groupQualifiers - closestBracket);
        const secondaryQualifiers = tournament.groupQualifiers - primaryQualifiers;

        const formedGroups = [];

        if (tournament) {
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                const formedGroup = {
                    name: group.name,
                    _id: group._id,
                    participants: [],
                    primaryQualifiers: primaryQualifiers / groups.length,
                    secondaryQualifiers: secondaryQualifiers / groups.length,
                    results: group.results,
                };
                formedGroup.participants = groupFormation[tournament.type](group);
                formedGroups.push(formedGroup);
            }
        }

        response.send(formedGroups);
    } catch (error) {
        next(boom.badData(error));
    }
};

exports.addparticipants = async function addparticipants(request, response, next) {
    try {
        const group = await Group.findOneAndUpdate({ _id: request.body.id },
            { $set: { participants: request.body.participants } });
        response.send(group);
    } catch (error) {
        next(boom.badData(error));
    }
};

exports.addparticipant = async function addparticipant(request, response, next) {
    try {
        const group = await Group.findOneAndUpdate({ _id: request.body.id },
            { $push: { participants: request.body.participant } });
        response.send(group);
    } catch (error) {
        next(boom.badData(error));
    }
};

function pair(array) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            result.push({
                home: array[i].id,
                away: array[j].id,
            });
        }
    }
    return result;
}

exports.start = async function start(request, response, next) {
    try {
        const { tournamentid } = request.body;
        const tournament = await Tournament.findById(tournamentid);

        const model = tournament.participantMode === participantModes.single ? Participant : Team;
        const groups = await Group.find({ tournament: tournamentid })
            .sort('name')
            .populate({ path: 'participants', model });

        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const results = pair(group.participants);
            Group.findByIdAndUpdate(group.id, { $set: { results } }, () => {});
        }

        response.send(tournamentid);
    } catch (error) {
        next(boom.badData(error));
    }
};

exports.addResult = async function addResult(request, response, next) {
    try {
        const {
            homeScore, awayScore, groupId, resultId,
        } = request.body;
        const group = await Group.findById(groupId);
        for (let i = 0; i < group.results.length; i++) {
            const result = group.results[i];
            if (result.id === resultId) {
                result.homeScore = homeScore;
                result.awayScore = awayScore;
            }
        }

        await Group.findByIdAndUpdate(groupId, { $set: { results: group.results } });

        response.send(group);
    } catch (error) {
        next(boom.badData(error));
    }
};
