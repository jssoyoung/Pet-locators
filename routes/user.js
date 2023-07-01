const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const petController = require('../controllers/pet');
const { Pets, Pictures, User, Likes, Comments } = require('../models/index');
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
router.get('/user/:id', userController.getOtherUser);
router.get('/contact', userController.getContact);
router.get('/settings', userController.getSettings);
router.post('/settings', userController.updateUser);
router.get('/addPet', userController.getAddPet);
router.post('/addPet', userController.postAddPet);
router.get('/cancel', userController.getCancel);

router.post('/search', userController.postSearch);
router.post('/pets/likes', userController.postLike);

router.get('/pets/:petId/:pictureId', userController.getPets);
router.post('/pets/comment', userController.postComment);

router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', authController.userLogout);
// router.get('/user/picture/:`{pictureUrl}`', pictureController.getPicture);

router.post('/pets/upload', upload.single('file'), async (req, res) => {
  const currentUserId = req.body.currentUser
  const petId = req.body.petId;
  let pictureId = req.body.pictureId;
  const pet = await Pets.findByPk(petId, {
    include: {model: User, as: "owner"}
  });
  if(currentUserId*1 !== pet.owner.id*1) {
    res.redirect(`/pets/${petId}/${pictureId}`);
    return
  } 
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
    let newPicture
    await storage.bucket(bucketName).upload(tempFilePath, options);
    setFileMetadata(bucketName, filePath).then(async (data) => {
      const pet = await Pets.findByPk(data.metadata.pet_id);
      newPicture = await Pictures.create({
        pictureUrl: `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/${process.env.GOOGLE_CLOUD_BUCKET_FOLDER}/${pictureName}`,
      });
      await pet.addPicture(newPicture);
      res.redirect(`/pets/${petId}/${newPicture.dataValues.id}`);
    });
    
  } catch (err) {
    res.status(500).send('Error uploading file');
  } finally {
    fs.unlinkSync(tempFilePath);
  }
});

module.exports = router;
