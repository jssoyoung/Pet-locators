const { User, Pets, Likes, Comments, Pictures } = require('../models/index');

exports.getHome = (req, res) => {
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getLocator = (req, res) => {
  res.render('locator', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getUser = async (req, res) => {
  let currentUser = req.session.user;
  currentUser = await User.findOne({
    raw: true,
    where: {
      id: currentUser.id,
    },
  });
  res.render('user', {
    username: currentUser.user_name,
    email: currentUser.email,
    location: 'Los Angeles, CA',
    pronouns: 'They/Them',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getContact = (req, res) => {
  res.render('contact', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postSearch = (req, res) => {
  console.log(req.body.userSearch);
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getPets = async (req, res) => {
  // const pet = Pets.findByPk(req.params.id, {raw: true,})
  const pet = await Pets.findByPk(1, {
    raw: true,
  });
  const petPictures = await Pictures.findAll({
    raw: true,
    where: {
      pet_id: pet.id,
    },
  });
  const urlList = petPictures.map((picture) => picture.pictureUrl);
  console.log(urlList);

  res.render('pet', {
    pictures: urlList,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postComment = async (req, res) => {
  const newComment = await Comments.create({
    user_id: 1,
    picture_id: 3,
    comment: req.body.comment,
  });
  res.render('pet', {
    comment: newComment.comment,
  });
};
