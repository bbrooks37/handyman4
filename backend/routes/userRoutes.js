const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/api/login', userController.login);
router.post('/api/signup', userController.signup);

module.exports = router;
