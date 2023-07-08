// Import User, Pets, Likes, Comments, and Pictures models:
const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
// Import Google Cloud Storage, tmp, fs, and uuidv4:
const { Storage } = require('@google-cloud/storage');
const tmp = require('tmp');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Define Google Cloud Storage credentials:
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Define Google Cloud Storage bucket name:
const bucketName = process.env.GOOGLE_CLOUD_BUCKET;

exports.getPets = async (req, res) => {
  // Grab petId and pictureId from the request parameters:
  const { petId, pictureId } = req.params;
  // Grab the user id from the session:
  const userId = req.session.user.id;
  // Find the pet by the pet id and include the user who owns the pet:
  const pet = await Pets.findByPk(petId, {
    include: { model: User, as: 'owner' },
  });

  // If the pet has likes, trim the likes string and split the string into an array:
  let petLikes;
  if (pet.likes) {
    petLikes = pet.likes.trim().split(',');
  }

  // Grab the owner's username and id:
  const owner = pet.owner.user_name;
  const ownerId = pet.owner.id;

  // Assign the main picture by the picture id:
  // This will display the picture clicked on by the user as main picture; it is from the req.params:
  const mainPicture = await Pictures.findByPk(pictureId);

  // Find all likes for the main picture and count the total number of likes:
  const totalLikes = await Likes.findAndCountAll({
    where: { picture_id: pictureId },
  });

  // Find all pictures for the pet and sort them by createdAt date in descending order:
  const allPictures = await Pictures.findAll({
    raw: true,
    where: { pet_id: pet.id },
  });
  const sortedPetPictures = allPictures.sort(
    (a, b) => b.createdAt - a.createdAt
  );

  // Find all comments for the main picture and include the user who posted the comment:
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
  });
};

// Render addPet page:
exports.getAddPet = (req, res) => {
  res.render('addPet', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

// Cancel adding pet and return the user to user page:
exports.getCancel = (req, res) => {
  res.render('user', {
    isLoggedIn: req.session.isLoggedIn,
  });
};

// Add pet to database:
exports.postAddPet = async (req, res) => {
  const currentUserId = req.session.user.id;
  await Pets.create({
    profile_picture: null,
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    likes: req.body.likes,
    breed: req.body.breed,
    description: req.body.description,
    user_id: currentUserId,
  });
  res.redirect('/user');
};

// TODO: uploadPetProfilePicture function:
exports.uploadPetProfilePicture = async (req, res) => {
  const petId = req.body.petId * 1;
  const pet = await Pets.findByPk(petId);
  const pictureName = uuidv4();

  const file = req.file;

  const tempFilePath = tmp.tmpNameSync();
  fs.writeFileSync(tempFilePath, file.buffer);

  const filePath = `pet-pictures/${pictureName}`;

  const options = {
    destination: filePath,
    metadata: {
      contentType: file.mimetype,
    },
  };
  try {
    await storage.bucket(bucketName).upload(tempFilePath, options);
    await pet.update({
      profile_picture: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/pet-pictures/${pictureName}`,
    });
    res.redirect(`/`);
  } catch (err) {
    res.status(500).send('Error uploading file');
  } finally {
    fs.unlinkSync(tempFilePath);
  }
};
