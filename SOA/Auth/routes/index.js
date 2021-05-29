const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

axios.defaults.baseURL = "http://" +
                          process.env.DL_HOSTNAME + ":" +
                          process.env.DL_PORT + "/";

/**
 * -------------- SIGN UP --------------
 */

router.post('/signup', async (req, res, next) => {
  // #swagger.tags = ['Sign up']
  // #swagger.summary = 'Signs a new user up'
  // hash password
  const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

  const user = { // create new user
    displayName: req.body.displayName,
    email: req.body.username,
    password: hash
  };

  axios.post('/user', user) // attempt to save user
      .then(response => {
        const { id, email } = response.data;

        const token = jwt.sign(
            { id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token });
      })
      .catch(error => {
        const { statusCode, message } = error.response.data;
        if (statusCode ===  400 && message === 'Email already exists') {
          res.status(statusCode).json({ message });
        }
        else {
          next(error);
        }
      });
});

/**
 * -------------- SIGN IN --------------
 */

router.post('/signin', passport.authenticate('local', { session: false }), (req, res) => {
  // #swagger.tags = ['Sign in']
  // #swagger.summary = 'Signs an existing user in'
  const token = jwt.sign(
      req.user,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({ token });
});

/**
 * -------------- PROTECTED --------------
 */

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  // #swagger.tags = ['Check access']
  // #swagger.summary = 'Authenticates a user by token'
  res.status(200).json(req.user);
});

module.exports = router;
