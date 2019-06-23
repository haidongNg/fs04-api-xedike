const express = require('express');
const userController = require('./users');
const {authenticating, authorizing} = require('../../../middleware/auth');
const {User} = require('../../../models/user');
const upload = require('../../../middleware/uploadImage');
const router = express.Router();
const passport = require('passport');


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



router.get('/test-private',
    passport.authenticate('jwt', {session: false}),
    //authorizing(['admin']),
    userController.test_private);

router.post('/upload-avatar',
    passport.authenticate('jwt', {session: false}),
    upload.single('avatar'), userController.uploadAvatar);


module.exports = router;