const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');

exports.getSettings = async (req, res) => {
  res.render('settings', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.updateUser = async (req, res) => {
  console.log('hello');
  const userId = req.session.user.id;
  const user = await User.findByPk(userId);
  console.log(req.body);
  await user.update({
    phone_number: req.body.phone_number * 1,
    pronouns: req.body.pronoun,
    city: req.body.city,
    state: req.body.state,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
  });
  res.redirect('/');
};
