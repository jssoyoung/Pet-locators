const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const petController = require('../controllers/pet');
const { Pets, Pictures } = require('../models/index');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const tmp = require('tmp');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET;

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get('/', userController.getHome);
router.get('/locator', userController.getLocator);
router.get('/user', userController.getUser);
router.get('/contact', userController.getContact);
router.get('/settings', userController.getSettings);

router.post('/search', userController.postSearch);
router.post('/pets/likes', userController.postLike);

router.get('/pets/:petId/:pictureId', userController.getPets);
router.post('/pets/comment', userController.postComment);

router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', authController.userLogout);
// router.get('/user/picture/:`{pictureUrl}`', pictureController.getPicture);

router.post('/pets/upload', upload.single('file'), async (req, res) => {
  const petId = req.body.petId;
  const pictureId = req.body.pictureId;
  const pet = await Pets.findByPk(petId, {
    raw: true,
  });
  const pet_Id = await pet.id;
  const pictureName = uuidv4();

  async function setFileMetadata(bucketName, fileName) {
    const [metadata] = await storage
      .bucket(bucketName)
      .file(fileName)
      .setMetadata({
        metadata: {
          id: pictureName,
          pet_id: pet_Id,
        },
      });

    console.log(
      'Updated metadata for object:',
      fileName,
      'in bucket:',
      bucketName
    );
    return metadata;
  }

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

    console.log('File uploaded successfully');
    res.redirect(`/pets/${petId}/${pictureId}`);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Error uploading file');
  } finally {
    fs.unlinkSync(tempFilePath);
    setFileMetadata(bucketName, filePath).then(async (data) => {
      const pet = await Pets.findByPk(data.metadata.pet_id);
      const newPicture = await Pictures.create({
        pictureUrl: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/${process.env.GOOGLE_CLOUD_BUCKET_FOLDER}/${pictureName}`,
      });
      await pet.addPicture(newPicture);
    });
  }
});

module.exports = router;
