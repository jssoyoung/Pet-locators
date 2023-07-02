const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getUser);
router.get('/:id', userController.getOtherUser);

module.exports = router;
