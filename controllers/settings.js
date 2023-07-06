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

exports.getSettings = async (req, res) => {
  const user = await User.findByPk(req.session.user.id);
  res.render('settings', {
    phone_number: user.phone_number * 1,
    pronouns: user.pronouns,
    city: user.city,
    state: user.state,
    twitter: user.twitter,
    facebook: user.facebook,
    instagram: user.instagram,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.session.user.id;
  const user = await User.findByPk(userId);

  await user.update({
    phone_number: req.body.phone_number || user.phone_number,
    pronouns: req.body.pronoun || user.pronouns,
    city: req.body.city || user.city,
    state: req.body.state || user.state,
    twitter: req.body.twitter || user.twitter,
    facebook: req.body.facebook || user.facebook,
    instagram: req.body.instagram || user.instagram,
    userProfilePicture: user.userPicture,
  });
  res.redirect('/user');
};

exports.uploadUserProfilePicture = async (req, res) => {
  console.log(req.session.user);
  const currentUserId = req.session.user.id;
  const user = await User.findByPk(currentUserId);
  const pictureName = uuidv4();
  console.log(user);

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
    res.redirect(`/`);
  } catch (err) {
    res.status(500).send('Error uploading file');
  } finally {
    fs.unlinkSync(tempFilePath);
  }
};
