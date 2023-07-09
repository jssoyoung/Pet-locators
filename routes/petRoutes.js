const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get('/:petId/:pictureId', petController.getPets);
router.post(
  '/update/upload',
  upload.single('file'),
  petController.uploadPetProfilePicture
);
router.post('/update/details', petController.updatePetDetails);

module.exports = router;
