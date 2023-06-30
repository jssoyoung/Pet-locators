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
  // get user from session storage:
  let currentUser = req.session.user;
  // find the user in database with the id of the storage found user:
  currentUser = await User.findOne({
    where: {
      id: currentUser.id,
    },
    include: { model: Pets, as: 'pets' },
  });
  // get all pets from the user along with pets' pictures:
  const userPets = await currentUser.getPets({
    include: {
      model: Pictures,
      as: 'pictures',
    },
  });

  // create an empty array to store all pets' information and their latest picture ids:
  const petData = [];

  // loop through each pet and find the latest picture's id:
  userPets.forEach((pet) => {
    const { name: petName, id: petId, pictures } = pet;
    if (pictures.length > 0) {
      const latestPicture = pictures[pictures.length - 1];
      const latestPictureId = latestPicture.id;
      // push to the empty array: petData:
      petData.push({ petName, petId, latestPictureId });
    }
  });

  res.render('user', {
    petData: petData ? petData : null,
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
  // for hidden input values in pet.handlebars;
  const petId = req.params.petId;
  const pictureId = req.params.pictureId;
  // find one pet using id from user's request:
  const pet = await Pets.findByPk(req.params.petId, { raw: true });
  // find main picture:
  const mainPicture = await Pictures.findOne({
    where: {
      id: pictureId,
    },
  });

  // find pictures of the found pet:
  const allPictures = await Pictures.findAll({
    raw: true,
    where: {
      pet_id: pet.id,
    },
  });
  // sort the pictures of the found pet's in descending createdAt, so latest picture loads first:
  const sortedPetPictures = allPictures.sort(
    (a, b) => b.createdAt - a.createdAt
  );
  // find all comments with the pictureId:
  console.log(sortedPetPictures);
  const comments = await Comments.findAll({
    raw: true,
    where: {
      picture_id: pictureId,
    },
  });
  res.render('pet', {
    pictureId: pictureId,
    petId: petId,
    mainPicture: mainPicture.pictureUrl,
    comments: comments,
    pet: pet,
    pictures: sortedPetPictures,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postComment = async (req, res) => {
  const petId = req.body.petId;
  const pictureId = req.body.pictureId;
  const user = req.session.user;
  const newComment = await Comments.create({
    petId: petId,
    user_id: user.id,
    picture_id: pictureId,
    comment: req.body.comment,
  });
  res.redirect(`/pets/${petId}/${pictureId}`);
};
