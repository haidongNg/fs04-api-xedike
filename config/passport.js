const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models/user');
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'Cybersoft';

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload)
        User.findOne({ _id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                console.log(jwt_payload)
                return done(null, jwt_payload);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}

