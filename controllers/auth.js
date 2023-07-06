const User = require('../models/User');
const validator = require('validator');
const { Op } = require('sequelize');
exports.userSignup = async (req, res) => {
  // Destructure signup form data:
  const { username, email, password, confirmPassword, pronouns, city, state } =
    req.body;
  // Check if passwords match:
  const passwordsMatch = password === confirmPassword;

  let status = null;
  let message = null;

  if (!username || !email || !password || !confirmPassword || !city || !state) {
    status = 400;
    message = 'Invalid input. Please provide valid values for all fields.';
  } else if (!validator.isAlpha(username)) {
    status = 400;
    message = 'Username must only consist of lower and upper characters.';
  } else if (!validator.isEmail(email)) {
    status = 400;
    message = 'Enter a valid email address.';
  } else if (!passwordsMatch) {
    status = 400;
    message = 'Passwords must match.';
  } else if (!validator.isStrongPassword(password)) {
    status = 400;
    message =
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
  } else {
    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ user_name: username }, { email: email }],
        },
      });

      if (existingUser) {
        status = 409;
        message = 'Username or email address is already registered.';
      } else {
        const newUser = await User.create(
          {
            user_name: username,
            email: email,
            password: password,
            city: city,
            state: state,
            pronouns: pronouns,
          },
          { individualHooks: true, returning: true }
        );
        req.session.isLoggedIn = true;
        req.session.user = newUser;
        status = 200;
        message = `Welcome, ${username}`;
      }
    } catch (error) {
      console.error('Error:', error);
      status = 500;
      message = 'An error occurred while creating the user.';
    }
  }

  res.status(status).json({ Status: status, Message: message });
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  let status = null;
  let message = null;

  if (user && validator.isEmail(email)) {
    const checkPassword = user.checkPassword(password);

    if (checkPassword) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      status = 200;
      message = `Welcome back, ${req.session.user.user_name}!`;
    } else {
      status = 400;
      message = 'Incorrect password, please try again.';
    }
  } else {
    status = 404;
    message = 'User not found, please try again.';
  }

  res.status(status).json({ Status: status, Message: message });
};

exports.userLogout = (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy(() => {
      res.status(204).redirect('/');
    });
  } else {
    res.status(404).end();
  }
};
