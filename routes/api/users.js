const express = require('express');
const {User} = require('../../models/user');
const router =express.Router();

// route    POST /api/users/register
// desc     register new user
// access   PUBLIC

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