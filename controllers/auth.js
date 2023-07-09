// Import User model:
const User = require('../models/User');
// Import validator to validate form data:
const validator = require('validator');
// Import sequelize OP to use query operators:
const { Op } = require('sequelize');

// Create user signup function:
exports.userSignup = async (req, res) => {
  // Destructure signup form data:
  const { username, email, password, confirmPassword, pronouns, city, state } =
    req.body;
  // Check if passwords match:
  const passwordsMatch = password === confirmPassword;

  // Declare status and message variables to be used in conditional statements:
  let status = null;
  let message = null;

  // Conditional statements to validate form data:
  // Checks for empty fields:
  if (!username || !email || !password || !confirmPassword || !city || !state) {
    status = 400;
    message = 'Invalid input. Please provide valid values for all fields.';
  } else if (!validator.isAlphanumeric(username)) {
    status = 400;
    message =
      'Username must only consist of numbers and lower and upper characters.';
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
      // Check if username or email already exists:
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ user_name: username }, { email: email }],
        },
      });
      // If username or email already exists, send error message:
      if (existingUser) {
        status = 409;
        message =
          'Username or email address is already registered, please use a different username or email address.';
      } else {
        // If username and email are unique, create new user:
        const newUser = await User.create(
          {
            user_name: username,
            email: email,
            password: password,
            city: city,
            state: state,
            pronouns: pronouns,
          },
          // Individual hooks are used to hash the password before it is stored in the database:
          { individualHooks: true, returning: true }
        );
        // Set session variables:
        req.session.isLoggedIn = true;
        req.session.user = newUser;
        status = 200;
        message = `Welcome, ${username}`;
      }
    } catch (error) {
      // If an error occurs, send error message:
      console.error('Error:', error);
      status = 500;
      message = 'An error occurred while creating the user.';
    }
  }
  // Send response:
  res.status(status).json({ Status: status, Message: message });
};

// User login function:
exports.userLogin = async (req, res) => {
  // Destructure login form data; grab email and password:
  const { email, password } = req.body;
  // Find user by email:
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  // Declare status and message variables to be used in conditional statements:
  let status = null;
  let message = null;

  // Conditional statements to validate form data; if user is found, check password:
  if (user) {
    const checkPassword = user.checkPassword(password);
    // If password is correct, set session variables:
    if (checkPassword) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      status = 200;
      message = `Welcome back, ${req.session.user.user_name}!`;
    } else {
      // If password is incorrect, send error message:
      status = 400;
      message = 'Incorrect password, please try again.';
    }
  } else {
    // If user is not found, send error message:
    status = 404;
    message = 'User not found, please try again.';
  }
  // Send response:
  res.status(status).json({ Status: status, Message: message });
};

exports.userLogout = async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      req.session.destroy(() => {
        res.status(204).redirect('/');
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
