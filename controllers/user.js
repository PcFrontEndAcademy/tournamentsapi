const passport = require('passport');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');
const boom = require('boom');

exports.login = async function(request, response, next){
    passport.authenticate('login', async (error, user, info) => {
        try{
            if(error || !user){
                next(boom.unauthorized());
            }

            request.login(user, {session: false}, async (error) => {
                if(error){
                    next(boom.unauthorized());
                }
                const body = {_id: user._id, email: user.email};
                const token = jwt.sign({user: body}, CONFIG.JWT_SECRET);
                response.json({token});
            });

        } catch(err){
            next(boom.unauthorized());
        }

    })(request, response);
}