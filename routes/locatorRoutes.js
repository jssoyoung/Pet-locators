const express = require('express');
const router = express.Router();
const locatorController = require('../controllers/locator');

router.get('/', locatorController.getLocator);

module.exports = router;
