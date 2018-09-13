const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('./config');
const db = require('../api/models/db');

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme(config.security.jwt.tokenPrefix),
    secretOrKey: config.security.jwt.jwtSecret,
    algorithms: config.security.jwt.algorithms,
};

async function verifyToken(payload, cb) {

}

async function mountUser(userId, cb) {
    try{
        const user = await db.User.findById(userId);
        if(user) {
            return cb(null, user);
        }
        return cb(null, false);
    } catch(err) {
        return cb(err, false);
    }
}

exports.jwtStrategy = new JWTStrategy(jwtOptions, mountUser);