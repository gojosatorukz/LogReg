const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateAuth = require('../middleware/validateAuth');

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

router.put('/update-profile', authController.updateProfile);

module.exports = router;