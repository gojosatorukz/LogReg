const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController'); 
const validateAuth = require('../middleware/validateAuth');

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

router.put('/update-profile', profileController.updateProfile);

module.exports = router;