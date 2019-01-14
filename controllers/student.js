const Student = require('../models/student');
const boom = require('boom');

exports.create = async function(request, response, next){
    try{
        let student = new Student({
            name: request.body.name,
            age: request.body.age,
            lector: request.body.lector
        });
    
        let result = await student.save();
        response.send(result);

    } catch(error) {
        next(boom.badData(error));
    }
}

exports.get = async function (request, response){
    let students = await Student.find().populate('lector');
    response.send(students);
}