const passport = require('passport');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { User } = require('../database/utils');

/**
 * -------------- SIGN IN LOCAL STRATEGY --------------
 */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
     // check if user exists
    const user = await User.create(userDetails);

    if (!user) { // could not find user
      return done(null, false);
    }
    // compare password hashes
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) { // hashes don't match
      return done(null, false);
    }

    return done(null, user.email);
  } catch(error) {
    done(error);
  }
}));

/**
 * -------------- PROTECTED JWT STRATEGY --------------
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  // axios.get(`/user/${jwt_payload.id}`) // check if user exists
  // console.log(jwt_payload.email);
  User.findByPk(jwt_payload.email)
    .then(user => {
      if (!user) { // could not find user
        return done(null, false);
      }

      // const { id, email } = response.data;
      return done(null, user.email);
    })
    .catch(error => {
      done(error);
    });
}));
