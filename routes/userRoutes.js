const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get('/', userController.getUser);
router.get('/:id', userController.getOtherUser);
router.post('/addPet/details', userController.addPetDetails);
router.post(
  '/changeProfilePicture',
  upload.single('file'),
  userController.changeProfilePicture
);

module.exports = router;
