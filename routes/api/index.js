const express = require('express');
const userController = require('./users');

const router = express.Router();

router.get('/register', userController.register);
router.post('/login', userController.login);
router.get('/test-private', userController.test_private);


module.exports = router;