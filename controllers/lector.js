const Lector = require('../models/lector');

exports.create = async function(request, response){
    let lector = new Lector({
        name: request.body.name,
        age: request.body.age
    });

    let result = await lector.save();
    response.send(result);
}

exports.get = async function (request, response){
    let lectors = await Lector.find().populate('students');
    response.send(lectors);
}