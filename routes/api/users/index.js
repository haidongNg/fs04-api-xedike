const express = require('express');
const userController = require('./users');
const {authenticating, authorizing } = require('../../../middleware/auth');
const {User} = require('../../../models/user');
const upload = require('../../../middleware/uploadImage');
const router = express.Router();

router.get('/test-private',
    authenticating,
    authorizing(['passenger', 'admin']),
    userController.test_private);

router.get('/:userId', userController.getUserId);

router.get('/', userController.getAllUser);

router.delete('/delete',
    authenticating,
    userController.deleteUser);

router.put('/update',
    authenticating,
    userController.updateUser);

router.post('/register', userController.register);

router.post('/login', userController.login);





router.post('/upload-avatar',
    authenticating,
    upload.single('avatar'), userController.uploadAvatar);


module.exports = router;