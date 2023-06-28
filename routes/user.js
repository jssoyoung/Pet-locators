const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.get('/', userController.getHome);
router.get('/locator', userController.getLocator);
router.get('/user', userController.getUser);
router.get('/contact', userController.getContact);

router.post('/search', userController.postSearch);

router.get('/pets', userController.getPets);
router.post('/comment', userController.postComment);

router.get('/pets/allPets', userController.getAllPetPictures);

router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', authController.userLogout);

module.exports = router;
