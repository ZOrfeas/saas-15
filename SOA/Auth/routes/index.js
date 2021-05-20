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
        return res.status(200).json({ id: id, email: email });
      })
      .catch(error => {
        const { statusCode: status, message: msg } = error.response.data;
        if (status ===  400 && msg === 'Email already exists') {
          return res.status(status).json({ message: 'email already exists' });
        }
        next(error);
      });
});

/**
 * -------------- SIGN IN --------------
 */

router.post('/signin', passport.authenticate('local', { session: false }), (req, res) => {
  res.status(200).json({
    token: jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
  });
});

/**
 * -------------- PROTECTED --------------
 */

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
