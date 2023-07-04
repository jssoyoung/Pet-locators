const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');
const { Storage } = require('@google-cloud/storage');
const tmp = require('tmp');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET;

exports.getSettings = async (req, res) => {
  const user = await User.findByPk(req.session.user.id)
  res.render('settings', {
    userProfilePicture: user.userPicture,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.updateUser = async (req, res) => {
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
    userProfilePicture: user.userPicture,
  });
  res.redirect('/');
};

exports.uploadUserProfilePicture = async (req, res) => {
  console.log(req.session.user)
  const currentUserId = req.session.user.id;
  const user = await User.findByPk(currentUserId);
  const pictureName = uuidv4();
  console.log(user)

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
      userPicture: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/user-pictures/${pictureName}`
    });
      res.redirect(`/`);
  } catch (err) {
    res.status(500).send('Error uploading file');
  } finally {
    fs.unlinkSync(tempFilePath);
  }
};