const express = require('express');
const {User} = require('../../models/users');
const router =express.Router();

// route POST/user/register
//desc register new user
// accress Public

router.post('/register', (req, res) => {
    const { email, password, fullName, userType, phone, dateOfBirth} = req.body;

    const newUser = new User({
        email, password, fullName, userType, phone, dateOfBirth
    });

    newUser.save()
            .then((user) => {res.status(200).json(user)})
            .catch((err) => {res.status(400).json(err)})
});


module.exports = router;