const bcrypt = require("bcryptjs");
// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {
  validateSignin,
  validateSignup,
  validateUpdateProfile,
  validateChangePassword
} = require("../../../validation/validate-users");
const { User } = require("../../../models/user");
const { Driver } = require("../../../models/driver");
const { Trip } = require("../../../models/trip");

// const router = express.Router();

// route    POST /api/users/register
// desc     register new user
// access   PUBLIC

const register = async (req, res) => {
  const { isValid, errors } = await validateSignup(req.body);
  if (!isValid) return res.status(400).json(errors);
  const {
    email,
    password,
    fullName,
    userType,
    phone,
    dateOfBirth,
    gender
  } = req.body;

  const newUser = new User({
    email,
    password,
    fullName,
    userType,
    phone,
    dateOfBirth,
    gender
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return Promise.reject(err);

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return Promise.reject(err);

      newUser.password = hash;
      return newUser
        .save()
        .then(user => {
          res.status(200).json(user);
        })
        .catch(err => {
          res.status(400).json(err);
        });
    });
  });
  // gia dinh input valid
  // User.findOne({ $or: [{ email, phone }] })
  //     .then(user => {
  //         if(user) return Promise.reject({errors: 'Email or Phone exists'})

  //     })
  //     .catch((err) => { res.status(400).json(err) })
};

// route    POST /api/users/login
// desc     login
// access   PUBLIC

const login = async (req, res) => {
  const { isValid, errors } = await validateSignin(req.body);
  if (!isValid) return res.status(400).json(errors);
  const { email, password, fingerprint } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    errors.email = "User does not exsits";
    return res.status(400).json(errors);
  }
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (!isMatch) {
      errors.password = "Password wrong";
      return res.status(400).json(errors);
    }

    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType
    };
    const KEY = process.env.SECRET_KEY + fingerprint;
    jwt.sign(payload, KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json({
        message: "success",
        // token: 'Bearer ' + token
        token
      });
    });
  });

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

  //                return res.status(200).json({
  //                     message: 'success',
  //                     token
  //                 })
  //             });

  //         })
  //     })
  //     .catch(err => res.status(400).json(err))
};

// route    POST /api/users/test-private
// desc     test private
// access   PRIVATE (chi cho nhung user da login)

const test_private = (req, res, next) => {
  res.status(200).json({ message: "Ban da thay duoc dieu bi mat" });
};

// router.get('/test-private', authenticating, authorizing(['passenger']), (req, res) => {
//     res.status(200).json({message: 'Ban da thay duoc dieu bi mat'})
// })

const uploadAvatar = (req, res, next) => {
  const { id } = req.user;
  User.findOne({ _id: id }, { avatar: 1 })
    .then(user => {
      if (!user) return Promise.reject({ errors: "User does not exist" });

      user.avatar = req.file.path;
      return user.save();
    })
    .then(user =>
      res.status(200).json({ message: "Upload Image Susscess", user })
    )
    .catch(err => res.status(400).json(err));
};

// route    GET /api/users/
// desc     get all user
// access   PUBLIC (Tat ca nguoi dung deu co the access)

const getAllUser = async (req, res, next) => {
  // User.find({})
  //     .then(user => res.status(200).json({message: 'success', user}))
  //     .catch(err => res.status(400).json(err))
  const users = await User.find({}, { password: 0 });
  if (!users) return res.status(400).json({ errors: "List User not found" });
  res.status(200).json({ message: "success", users });
};

// route    PUT /api/users/:userId
// desc     PUT user
// access   PRIVATE (Chi co user dang nhap vao he thong thi moi duoc chinh sua)

const updateUser = async (req, res, next) => {
  const { isValid, errors } = await validateUpdateProfile(req.body);
  if (!isValid) return res.status(400).json(errors);
  const { id } = req.user;
  const user = await User.findById(id);
  if (!id) return res.status(400).json({ error: "User does not exist" });
  const { fullName, gender, dateOfBirth } = req.body;

  if (!fullName || !gender || !dateOfBirth)
    return res.status(400).json({ error: "Error form" });

  user.fullName = fullName;
  user.gender = gender;
  user.dateOfBirth = dateOfBirth;
  const newUser = await user.save();
  if (!newUser) return res.status(400).json({ error: "User update failed" });
  res.status(200).json({ message: "Update users successfully" });
};

// route    GET /api/users/:userId
// desc     get user
// access   PUBLIC (Tat ca nguoi dung deu co the access)
const getUserById = (req, res, next) => {
  const { id } = req.user;
  User.findById(id, { password: 0 })
    .then(user => {
      if (!user) return res.status(400).json({ error: "User does not exist" });
      res.status(200).json(user);
    })
    .catch(err => res.status(400).json(err));
};

// route    DELETE /api/users/:userId
// desc     get user
// access   PUBLIC (User dang nhap co the access)
const deleteUser = async (req, res, next) => {
  const { id } = req.user;
  await User.findByIdAndDelete(id, (err, user) => {
    if (err) return res.status(400).json(err);
    res.status(200).json({ message: "Delete successfullys   " });
  });
};

const rateDriver = async (req, res, next) => {
  const driverId = req.params.driverId;
  const driver = await Driver.findOne({ userId: driverId });
  if (!driver) return res.status(400).json({ error: "Driver does not exist" });

  const { raiting } = req.body;
  await driver.passengerRates.push(raiting);
  await driver
    .save()
    .then(dri => {
      res.status(200).json({ message: "Raiting successfully" });
    })
    .catch(err => res.status(400).json(err));
};

// route    PUT /api/users/change-password
// desc     update password
// access   PUBLIC (User dang nhap co the access)
const changePassword = async (req, res, next) => {
  const { isValid, errors } = await validateChangePassword(req.body);
  if (!isValid) return res.status(400).json(errors);
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ error: "User does not exist" });
  const { oldPassword, newPassword } = req.body;
  // lay oldpassword la yeu cau nhap password cu  dem so sanh voi password hasing luu ten database
  // neu dung thi newpassword cap nhap lai cho user
  // hashing password luu tren db
  bcrypt.compare(oldPassword, user.password).then(isMatch => {
    if (!isMatch) {
      errors.oldPassword = "Wrong password";
      return res.status(400).json(errors);
    }
    user.password = newPassword;

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(400).json(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return res.status(400).json(err);
        user.password = hash;

        user.save().then(u => {
          res.status(200).json({ message: "Change password successfully" });
        });
      });
    });
  });
};

// route    PUT /api/users/trip-history
// desc     get trip history
// access   private (User dang nhap co the access)

const getTripHistory = (req, res, next) => {
  const { id } = req.user;

  Promise.all([
    User.findById(id),
    Trip.find({ "passengers.passengerId": { $eq: id } }).populate({
      path: "driverId",
      model: User,
      select: "fullName gender avatar"
    }),
    Driver.find({}, { passengerRates: 1, carInfo: 1, userId: 1 })
  ])
    .then(result => {
      debugger;
      const passenger = result[0];
      const trips = result[1];
      const drivers = result[2];
      
      if (!passenger) Promise.reject({ error: "User not found" });
      const list = trips.map(trip => {
        const driver = drivers.find(
          u => u.userId.toString() === trip.driverId._id.toString()
        );
        if (driver) {
          list.push({ trip, driver });
        }
      });
      return list;
    })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};

module.exports = {
  register,
  login,
  test_private,
  uploadAvatar,
  getAllUser,
  updateUser,
  deleteUser,
  getUserById,
  rateDriver,
  changePassword,
  getTripHistory
};
