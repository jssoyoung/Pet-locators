const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');

exports.getHome = (req, res) => {
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
    isHomePage: true,
  });
};