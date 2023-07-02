const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/upload');

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  '/',
  upload.single('file'),
  uploadController.uploadPicture
);

module.exports = router;
