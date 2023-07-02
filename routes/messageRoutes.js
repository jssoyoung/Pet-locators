const express = require('express');
const router = express.Router();
const chatController = require('../controllers/message');

router.post('/send', chatController.sendMessage);
router.get('/', chatController.displayMessages);

module.exports = router;
