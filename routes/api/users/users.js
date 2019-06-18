const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../../models/user');

// const router = express.Router();

// route    POST /api/users/register
// desc     register new user
// access   PUBLIC

const register = (req, res) => {
    const { email, password, fullName, userType, phone, dateOfBirth } = req.body;

    // gia dinh input valid
    User.findOne({ $or: [{ email, phone }] })
        .then(user => {
            if(user) return Promise.reject({errors: 'Email or Phone exists'})
            
            const newUser = new User({
                email, password, fullName, userType, phone, dateOfBirth
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) return Promise.reject(err);

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return Promise.reject(err);

                    newUser.password = hash;
                    return newUser.save()
                        .then((user) => { res.status(200).json(user) })
                        .catch((err) => { res.status(400).json(err) });
                })

            });
        })
        .catch((err) => { res.status(400).json(err) })
}


// route    POST /api/users/login
// desc     login
// access   PUBLIC

const login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) return Promise.reject({ errors: 'User does not exst' });

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (!isMatch) return res.status(400).json({ errors: 'Wrong password' });

                const payload = {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    userType: user.userType
                }
                jwt.sign(payload, 'Cybersoft', { expiresIn: '1h' }, (err, token) => {
                    if (err) return res.status(400).json(err);

                    res.status(200).json({
                        message: 'success',
                        token
                    })
                });

            })
        })
        .catch(err => res.status(400).json(err))
}


// route    POST /api/users/test-private
// desc     test private
// access   PRIVATE (chi cho nhung user da login)

const test_private = (req, res, next) => {
    res.status(200).json({message: 'Ban da thay duoc dieu bi mat'})
}

// router.get('/test-private', authenticating, authorizing(['passenger']), (req, res) => {
//     res.status(200).json({message: 'Ban da thay duoc dieu bi mat'})
// })




const uploadAvatar = (req, res, next) => {
    const { id } = req.user;
    User.findById(id)
        .then(user => {
            if(!user) return Promise.reject({errors: 'User does not exist'});

            user.avatar = req.file.path;
            return user.save();
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err))
}

module.exports = {
    register,
    login,
    test_private,
    uploadAvatar
}