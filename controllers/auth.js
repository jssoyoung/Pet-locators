const User = require('../models/User');
const validator = require('validator');

exports.userSignup = async (req, res) => {
  const username = validator.isAlpha(req.body.username)
    ? req.body.username
    : res.status(404).json({
        Status: 404,
        Message: 'Username must only consist lower and upper characters.',
      });
  const email = validator.isEmail(req.body.email)
    ? req.body.email
    : res
        .status(404)
        .json({ Status: 404, Message: 'Enter a valid email address' });
  const password = (req.body.password) //validator.isStrongPassword(req.body.password)
    ? req.body.password
    : res.status(404).json({
        Status: 404,
        Message:
          'Password must be a minimum length of 8 characters, at least one lowercase letter, one uppercase letter, one numerical digit, and one symbol.',
      });
  const confirmPassword = req.body.confirmPassword;
  const passwordsMatch = password === confirmPassword;
  if (!passwordsMatch) {
    res.status(404).json({
      Status: 404,
      Message: 'Passwords must match!',
    });
  } else {
    const newUser = await User.create({
      user_name: username,
      email: email,
      password: password,
    });
    req.session.isLoggedIn = true;
    req.session.user = newUser;
    res.redirect('/user');
  }
};

exports.userLogin = async (req, res) => {
  const email = validator.isEmail(req.body.email)
    ? req.body.email
    : res.json({ Status: 404, Message: 'Enter a valid email address' });
  const password = req.body.password;
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user && validator.isEmail(email)) {
    const checkPassword = user.checkPassword(password)
      ? user.checkPassword(password)
      : res.json({ Status: 404, Message: 'Wrong password!' });

    if (checkPassword) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.render('home', {
        isLoggedIn: req.session.isLoggedIn,
      });
    } else {
      console.error('Incorrect password');
    }
  } else {
    console.error('User not found');
  }
};

exports.userLogout = (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.status(404).end();
  }
};
