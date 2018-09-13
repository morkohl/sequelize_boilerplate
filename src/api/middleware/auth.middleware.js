const passport = require('passport');

exports.authenticate = function() {
    return async function(req, res, next) {
        passport.authenticate('jwt', {session: false}, await checkToken(req, res, next))(req, res, next);
    };
};

async function checkToken(req, res, next) {

}