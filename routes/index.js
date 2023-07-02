const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const petRoutes = require('./petRoutes');
const authRoutes = require('./authRoutes');
const commentRoutes = require('./commentRoutes');
const contactRoutes = require('./contactRoutes');
const likeRoutes = require('./likeRoutes');
const locatorRoutes = require('./locatorRoutes');
const homeRoutes = require('./homeRoutes');
const uploadRoutes = require('./uploadRoutes');
const settingsRoutes = require('./settingsRoutes');

router.use('/', homeRoutes);
router.use('/user', authRoutes);
router.use('/user', userRoutes);
router.use('/pets', petRoutes);
router.use('/comment', commentRoutes);
router.use('/contact', contactRoutes);
router.use('/like', likeRoutes);
router.use('/locator', locatorRoutes);
router.use('/upload', uploadRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
