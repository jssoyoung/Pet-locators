const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like');

router.post('/', likeController.postLike);

module.exports = router;
