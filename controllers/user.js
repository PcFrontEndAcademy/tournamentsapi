const passport = require('passport');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');
const UserModel = require('../models/user');

exports.signUp = async function(request, response){
    const {email, password, age} = request;
    const user = await UserModel.create({email, password, age});
    response.json({
        message: 'Sign up sucessful',
        user: user
    });
}

exports.login = async function(request, response){
    passport.authenticate('login', async (error, user, info) => {
        try{
            if(error || !user){
                response.send(info);
            }

            request.login(user, {session: false}, async (error) => {
                if(error){
                    response.send(error);
                }
                const body = {_id: user._id, email: user.email};
                const token = jwt.sign({user: body}, CONFIG.JWT_SECRET);
                response.json({token});
            });

        } catch(err){
            response.send(err.message);
        }

    })(request, response);
}