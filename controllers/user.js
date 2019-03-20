const passport = require('passport');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');

exports.login = async function(request, response){
	// async function instead of arrow function
	// try to the top
    passport.authenticate('login', async (error, user, info) => {
        try{
			const isAuthenticationFailed = error || !user;
            if(isAuthenticationFailed){
                response.send(info);
            }

			// async function
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