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
const messageRoutes = require('./messageRoutes')
const withAuth = require('../utils/auth');

router.use('/', homeRoutes);
router.use('/user', authRoutes);
router.use('/user', withAuth, userRoutes);
router.use('/pets', withAuth, petRoutes);
router.use('/comment', withAuth, commentRoutes);
router.use('/contact', withAuth, contactRoutes);
router.use('/like', withAuth, likeRoutes);
router.use('/locator', withAuth, locatorRoutes);
router.use('/messages', withAuth, messageRoutes);
router.use('/upload', withAuth, uploadRoutes);
router.use('/settings', withAuth, settingsRoutes);


module.exports = router;
