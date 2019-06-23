const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../../../validation/validateRegisterInput');
const validateLoginInput = require('../../../validation/validateLoginInput')
const { User } = require('../../../models/user');

// const router = express.Router();

// route    POST /api/users/register
// desc     register new user
// access   PUBLIC

const register = async (req, res) => {
    const { isValid, errors } = await validateRegisterInput(req.body);
    if (!isValid) return res.status(400).json(errors);
    const { email, password, fullName, userType, phone, dateOfBirth } = req.body;

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
    // gia dinh input valid
    // User.findOne({ $or: [{ email, phone }] })
    //     .then(user => {
    //         if(user) return Promise.reject({errors: 'Email or Phone exists'})

    //     })
    //     .catch((err) => { res.status(400).json(err) })
}


// route    POST /api/users/login
// desc     login
// access   PUBLIC

const login = async (req, res) => {
    const {isValid, errors} = await validateLoginInput(req.body);
    if(!isValid) return res.status(400).json(errors);
    const { email, password } = req.body;

    const user  = await User.findOne({email});
    if(!user) return res.status(400).json({error: 'User does not exsits'});
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

    // User.findOne({ email })
    //     .then(user => {
    //         if (!user) return Promise.reject({ errors: 'User does not exsits' });

    //         bcrypt.compare(password, user.password, (err, isMatch) => {
    //             if (!isMatch) return res.status(400).json({ errors: 'Wrong password' });

    //             const payload = {
    //                 id: user._id,
    //                 email: user.email,
    //                 fullName: user.fullName,
    //                 userType: user.userType
    //             }
    //             jwt.sign(payload, 'Cybersoft', { expiresIn: '1h' }, (err, token) => {
    //                 if (err) return res.status(400).json(err);

    //                 res.status(200).json({
    //                     message: 'success',
    //                     token
    //                 })
    //             });

    //         })
    //     })
    //     .catch(err => res.status(400).json(err))
}


// route    POST /api/users/test-private
// desc     test private
// access   PRIVATE (chi cho nhung user da login)

const test_private = (req, res, next) => {
    res.status(200).json({ message: 'Ban da thay duoc dieu bi mat' })
}

// router.get('/test-private', authenticating, authorizing(['passenger']), (req, res) => {
//     res.status(200).json({message: 'Ban da thay duoc dieu bi mat'})
// })




const uploadAvatar = (req, res, next) => {
    const { id } = req.user;
    User.findById(id)
        .then(user => {
            if (!user) return Promise.reject({ errors: 'User does not exist' });

            user.avatar = req.file.path;
            return user.save();
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err))
}


// route    GET /api/users/
// desc     get all user
// access   PUBLIC (Tat ca nguoi dung deu co the access)

const getAllUser = async (req, res, next) => {
    // User.find({})
    //     .then(user => res.status(200).json({message: 'success', user}))
    //     .catch(err => res.status(400).json(err))
    const users = await User.find({}, { password: 0 });
    if (!users) return res.status(400).json({ errors: 'List User not found' })
    res.status(200).json({ message: 'success', users })
}

// route    GET /api/users/:userId
// desc     get user
// access   PUBLIC (Tat ca nguoi dung deu co the access)

const getUserId = async (req, res, next) => {
    const { userId } = req.params;
    // User.findById(userId)
    //     .then(user => {
    //         if(!user) return Promise.reject({errors: 'User not found'});
    //         res.status(200).json(user);
    //     })
    //     .catch(err => res.status(400).json(err))
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ errors: 'User not found' });

    res.status(200).json(user);
}


// route    PUT /api/users/:userId
// desc     PUT user
// access   PRIVATE (Chi co user dang nhap vao he thong thi moi duoc chinh sua)

const updateUser = async (req, res, next) => {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
        if (err) return res.status(400).json(err);
        res.status(200).json({ message: 'success', user });
    })

    res.status(200).json({ message: 'success', userUp });
}

const deleteUser = async (req, res, next) => {
    const { id } = req.user;
    await User.findByIdAndDelete(id, (err, user) => {
        if (err) return res.status(400).json(err);
        res.status(200).json({ message: 'success', user });
    });
}

module.exports = {
    register,
    login,
    test_private,
    uploadAvatar,
    getAllUser,
    getUserId,
    updateUser,
    deleteUser
}