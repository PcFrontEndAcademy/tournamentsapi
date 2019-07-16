const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const CONFIG = require('../config');

async function passUser(token, done) {
    try {
        done(null, token.user);
    } catch (error) {
        done(error);
    }
}
const jwtStrategy = new JWTStrategy({
    secretOrKey: CONFIG.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromHeader(CONFIG.JWT_HEADER_KEY),
}, passUser);

passport.use('jwt', jwtStrategy);
