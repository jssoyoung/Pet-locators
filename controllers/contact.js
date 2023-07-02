const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');

exports.getContact = (req, res) => {
  res.render('contact', {
    isLoggedIn: req.session.isLoggedIn,
  });
};
