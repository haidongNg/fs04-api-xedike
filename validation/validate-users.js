const validator = require("validator");
const _ = require("lodash");
const { User } = require("../models/user");

const validateSignup = async data => {
  let errors = {};
  // req.body
  // kiem tra xem input co bi bo trong hay ko
  // neu input ma bi bo trong thi cho no la ""
  // data.email = data.email ? data.email : ""
  data.email = _.get(data, "email", "");
  data.password = _.get(data, "password", "");
  data.password2 = _.get(data, "password2", "");
  data.fullName = _.get(data, "fullName", "");
  data.gender = _.get(data, "gender", "");
  data.userType = _.get(data, "userType", "");
  data.phone = _.get(data, "phone", "");
  data.dateOfBirth = _.get(data, "dateOfBirth", "");

  // _.toPairs() // Object ==> arr
  // _.fromPairs() // Arr => Obj

  // data (obj) => data (array) => map(return tung elm)

  // validate
  // email
  if (validator.isEmpty(data.email)) errors.email = "Email is required";
  // true: "", false: co gia tri
  else if (!validator.isEmail(data.email)) errors.email = "Email  is Invalid";
  // true: email valid, false: email invalid
  else {
    const user = await User.findOne({ email: data.email });
    if (user) errors.email = "Email exists";
  }

  // password
  if (validator.isEmpty(data.password))
    errors.password = "Password is required";
  else if (!validator.isLength(data.password, { min: 6 }))
    errors.password = "Password has is least 6 characters";

  // password2
  if (validator.isEmpty(data.password2))
    errors.password2 = "Confirm password is required";
  else if (!validator.equals(data.password, data.password2))
    errors.password2 = "Password is not match";

  // phone
  if (validator.isEmpty(data.phone)) errors.phone = "Phone is required";
  else if (!validator.isLength(data.phone, { min: 10, max: 10 }))
    errors.phone = "Phone has is least 10 number";
  else {
    const user = await User.findOne({ phone: data.phone });
    if (user) errors.phone = "Phone exists";
  }

  // fullName
  if (validator.isEmpty(data.fullName))
    errors.fullName = "FullName is required";
  else if (!validator.isLength(data.fullName, { min: 2, max: 30 }))
    errors.fullName = "FullName must be between 2 and 30 characters";

  // gender
  if (validator.isEmpty(data.gender)) errors.gender = "Gender is required";
  else if (
    !validator.equals(data.gender, "nam") &&
    !validator.equals(data.gender, "nu") &&
    !validator.equals(data.gender, "other")
  )
    errors.sex = "Choose Nam or Nu or Othe";

  // userType
  if (validator.isEmpty(data.userType))
    errors.userType = "UserType is required";
  else if (
    !validator.equals(data.userType, "passenger") &&
    !validator.equals(data.userType, "driver") &&
    !validator.equals(data.userType, "admin")
  )
    errors.userType = "Choose Passenger or Driver";

  // Date birth date
  if (validator.isEmpty(data.dateOfBirth))
    errors.dateOfBirth = "Date is required";
  else if (!validator.toDate(data.dateOfBirth))
    errors.dateOfBirth = "date found";

  return {
    // isValid: true neu errors la {}; isValid: false khi erros co thuoc tinh
    isValid: _.isEmpty(errors),
    errors
  };
};

const validateSignin = async data => {
  let errors = {};
  data.email = _.get(data, "email", "");
  data.password = _.get(data, "password", "");

  if (validator.isEmpty(data.email)) errors.email = "Email is required";
  // true: "", false: co gia tri
  else if (!validator.isEmail(data.email)) errors.email = "Email  is Invalid";
  // true: email valid, false: email invalid

  // password
  if (validator.isEmpty(data.password))
    errors.password = "Password is required";
  else if (!validator.isLength(data.password, { min: 6 }))
    errors.password = "Password has is least 6 characters";

  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

const validateUpdateProfile = async data => {
  let errors = {};
  data.fullName = _.get(data, "fullName", "");
  data.dateOfBirth = _.get(data, "dateOfBirth", "");

  if (validator.isEmpty(data.fullName))
    errors.fullName = "fullName is required";

  if (validator.isEmpty(data.dateOfBirth))
    errors.dateOfBirth = "dateOfBirth  is Invalid";
  else if (!validator.toDate(data.dateOfBirth))
    errors.dateOfBirth = "date found";

  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

const validateChangePassword = async data => {
  let errors = {};
  data.oldPassword = _.get(data, "oldPassword", "");
  data.newPassword = _.get(data, "newPassword", "");

  if (validator.isEmpty(data.oldPassword))
    errors.oldPassword = "Email is required";
  else if (!validator.isLength(data.oldPassword, { min: 6 }))
    errors.oldPassword = "oldPassword has is least 6 characters";

  if (validator.isEmpty(data.newPassword))
    errors.newPassword = "newPassword is required";
  else if (!validator.isLength(data.newPassword, { min: 6 }))
    errors.newPassword = "newPassword has is least 6 characters";

  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateProfile,
  validateChangePassword
};
