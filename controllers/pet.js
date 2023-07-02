const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');
exports.getPets = async (req, res) => {
  const { petId, pictureId } = req.params;
  const userId = req.session.user.id;
  const user = await User.findByPk(userId);
  const pet = await Pets.findByPk(petId, {
    include: { model: User, as: 'owner' },
  });

  let petLikes;
  if (pet.likes) {
    petLikes = pet.likes.trim().split(',');
  }

  const owner = pet.owner.user_name;
  const ownerId = pet.owner.id;

  const mainPicture = await Pictures.findByPk(pictureId);

  const totalLikes = await Likes.findAndCountAll({
    where: { picture_id: pictureId },
  });

  const allPictures = await Pictures.findAll({
    raw: true,
    where: { pet_id: pet.id },
  });

  const sortedPetPictures = allPictures.sort(
    (a, b) => b.createdAt - a.createdAt
  );
  const pictureIds = sortedPetPictures.map((picture) => picture.id);

  const comments = await Comments.findAll({
    raw: true,
    where: { picture_id: pictureId },
    include: { model: User, as: 'user' },
  });

  res.render('pet', {
    totalLikes: totalLikes.count,
    userId,
    pictureId,
    petId,
    mainPicture: mainPicture.pictureUrl,
    comments,
    pet,
    pictures: sortedPetPictures,
    isLoggedIn: req.session.isLoggedIn,
    owner,
    petLikes,
    ownerId,
    pictureIds,
  });
};

exports.getAddPet = (req, res) => {
  res.render('addPet', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getCancel = (req, res) => {
  res.render('user', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postAddPet = async (req, res) => {
  const currentUser = req.session.user.id;
  const newPet = await Pets.create({
    profile_picture: null,
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    likes: req.body.likes,
    breed: req.body.breed,
    description: req.body.description,
    user_id: currentUser,
  });
  res.redirect('/user');
};
