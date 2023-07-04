const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
  });

router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateUser);
router.post('/upload', upload.single('file'), settingsController.uploadUserProfilePicture);

module.exports = router;
