const express = require('express');
const router = express.Router();
const locatorController = require('../controllers/locator');

router.get('/', locatorController.getLocator);
router.post('/search', locatorController.postSearch);

module.exports = router;
