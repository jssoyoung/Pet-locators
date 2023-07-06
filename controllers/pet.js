const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Storage } = require('@google-cloud/storage');
const tmp = require('tmp');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET;

exports.getPets = async (req, res) => {
  const { petId, pictureId } = req.params;
  const userId = req.session.user.id;
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
