const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
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

exports.getUser = async (req, res) => {
  const currentUser = await User.findByPk(req.session.user.id, {
    include: {
      model: Pets,
      as: 'pets',
      include: { model: Pictures, as: 'pictures' },
    },
  });

  const hasAccess = req.session.user.id === currentUser.id;

  const petData = currentUser.pets.reduce((data, pet) => {
    const { name: petName, id: petId, pictures } = pet;
    if (pictures.length > 0) {
      const latestPicture = pictures[pictures.length - 1];
      const latestPictureId = latestPicture.id;
      const profilePicture = pet.profile_picture;
      const isOwner = currentUser.id === req.session.user.id;
      data.push({ petName, petId, latestPictureId, profilePicture, isOwner });
    }
    return data;
  }, []);

  res.render('user', {
    hasAccess: hasAccess,
    isUserPage: true,
    petData: petData.length > 0 ? petData : null,
    userId: currentUser.id,
    username: currentUser.user_name,
    userPicture: currentUser.userPicture,
    email: currentUser.email,
    city: currentUser.city,
    state: currentUser.state,
    pronouns: currentUser.pronouns,
    phone_number: currentUser.phone_number,
    twitter: currentUser.twitter,
    facebook: currentUser.facebook,
    instagram: currentUser.instagram,
    isLoggedIn: req.session.isLoggedIn,
    createdAt: currentUser.createdAt,
  });
};

exports.getOtherUser = async (req, res) => {
  const otherUser = await User.findByPk(req.params.id, {
    include: {
      model: Pets,
      as: 'pets',
      include: { model: Pictures, as: 'pictures' },
    },
  });

  const hasAccess = req.session.user.id === otherUser.id;

  const petData = otherUser.pets.reduce((data, pet) => {
    const { name: petName, id: petId, pictures } = pet;
    if (pictures.length > 0) {
      const latestPicture = pictures[pictures.length - 1];
      const latestPictureId = latestPicture.id;
      const profilePicture = pet.profile_picture;
      data.push({ petName, petId, latestPictureId, profilePicture });
    }
    return data;
  }, []);

  res.render('user', {
    hasAccess: hasAccess,
    isUserPage: true,
    petData: petData.length > 0 ? petData : null,
    userPicture: otherUser.userPicture,
    userId: otherUser.id,
    username: otherUser.user_name,
    email: otherUser.email,
    city: otherUser.city,
    state: otherUser.state,
    pronouns: otherUser.pronouns,
    phone_number: otherUser.phone_number,
    twitter: otherUser.twitter,
    facebook: otherUser.facebook,
    instagram: otherUser.instagram,
    isLoggedIn: req.session.isLoggedIn,
    createdAt: otherUser.createdAt,
  });
};

exports.addPetDetails = async (req, res) => {
  try {
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
    res.status(200).json({ message: 'Pet added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.changeProfilePicture = async (req, res) => {
  const currentUserId = req.session.user.id;
  const user = await User.findByPk(currentUserId);
  const pictureName = uuidv4();

  const file = req.file;

  const tempFilePath = tmp.tmpNameSync();
  fs.writeFileSync(tempFilePath, file.buffer);

  const filePath = `user-pictures/${pictureName}`;

  const options = {
    destination: filePath,
    metadata: {
      contentType: file.mimetype,
    },
  };
  try {
    await storage.bucket(bucketName).upload(tempFilePath, options);
    await user.update({
      userPicture: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/user-pictures/${pictureName}`,
    });
    res.status(200).json({
      userPicture: user.userPicture,
      message: 'User profile picture changed successfully',
    });
  } catch (err) {
    res.status(500).send('Error uploading file');
  } finally {
    fs.unlinkSync(tempFilePath);
  }
};
