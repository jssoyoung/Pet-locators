const { User } = require('../models/index');
const { Op } = require('sequelize');

exports.getLocator = async (req, res) => {
  const { city, state } = await User.findOne({
    where: { id: req.session.user.id },
  });
  const sameCityUsers = await User.findAll({
    where: {
      id: { [Op.not]: req.session.user.id },
      city,
      state,
    },
  });
  res.render('locator', {
    usersInTheSameCity: sameCityUsers,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postSearch = (req, res) => {
  console.log(req.body.userSearch);
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
  });
};
