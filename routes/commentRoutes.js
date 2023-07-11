const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const withAuth = require('../utils/auth');

router.post('/', commentController.postComment);
router.delete('/', commentController.deleteComment);

module.exports = router;
