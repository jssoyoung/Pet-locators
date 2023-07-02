const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet');

router.get('/:petId/:pictureId', petController.getPets);

router.get('/addPet', petController.getAddPet);
router.post('/addPet', petController.postAddPet);
router.get('/cancel', petController.getCancel);


module.exports = router;
