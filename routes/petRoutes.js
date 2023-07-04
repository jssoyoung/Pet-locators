const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
  });

router.get('/:petId/:pictureId', petController.getPets);

router.get('/addPet', petController.getAddPet);
router.post('/addPet', petController.postAddPet);
router.get('/cancel', petController.getCancel);
router.post('/upload', upload.single('file'), petController.uploadPetProfilePicture);
router.post('/edit', petController.getEditPet);


module.exports = router;
