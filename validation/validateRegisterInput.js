const validator = require('validator');
const _ = require('lodash');
const { User } = require('../models/user');


validateResgisterInput = async (data) => {
    let errors = {};
    // req.body
    // kiem tra xem input co bi bo trong hay ko
    // neu input ma bi bo trong thi cho no la ""
    // data.email = data.email ? data.email : ""
    data.email = _.get(data, 'email', '');
    data.password = _.get(data, 'password', '');
    data.password2 = _.get(data, 'password2', '');
    data.fullName = _.get(data, 'fullName', '');
    data.userType = _.get(data, 'userType', '');
    data.phone = _.get(data, 'phone', '');
    data.dateOfBirth = _.get(data, 'dateOfBirth', '');


    // _.toPairs() // Object ==> arr
    // _.fromPairs() // Arr => Obj

    // data (obj) => data (array) => map(return tung elm)

    // validate
    // email
    if (validator.isEmpty(data.email)) errors.email = 'Email is required'; // true: "", false: co gia tri
    else if (!validator.isEmail(data.email)) errors.email = 'Email  is valid';  // true: email valid, false: email invalid
    else {
        const user = await User.findOne({ email: data.email });
        if (user) errors.email = 'Email exists';
    }

    // password
    if (validator.isEmpty(data.password)) errors.password = 'Password is required';
    else if (!validator.isLength(data.password, { min: 6 })) errors.password = 'Password has is least 6 characters';

    // password2
    if (validator.isEmpty(data.password2)) errors.password2 = 'Confirm password is required';
    else if (!validator.equals(data.password, data.password2)) errors.password2 = 'Password is not match';

    // phone
    if (validator.isEmpty(data.phone)) errors.phone = 'Phone is required';
    else if (!validator.isLength(data.phone, { min: 10, max: 10 })) errors.phone = 'Phone has is least 10 number';
    else {
        const user = await User.findOne({ phone: data.phone });
        if (user) errors.phone = 'Phone exists';
    }

    // fullName
    if (validator.isEmpty(data.fullName)) errors.fullName = 'FullName is required';
    else if (!validator.isLength(data.fullName, { min: 2, max: 30 })) errors.fullName = 'FullName must be between 2 and 30 characters';

    // userType
    if (validator.isEmpty(data.userType)) errors.userType = 'UserType is required';
    else if (!validator.equals(data.userType, 'passenger') && !validator.equals(data.userType, 'driver')) errors.userType = 'Choose Passenger or Driver';

    // Date birth date
    if (validator.isEmpty(data.dateOfBirth)) errors.dateOfBirth = 'Date is required';
    else if (!validator.toDate(data.dateOfBirth)) errors.dateOfBirth = 'date found'

    return {
        // isValid: true neu errors la {}; isValid: false khi erros co thuoc tinh
        isValid: _.isEmpty(errors),
        errors
    }
}

module.exports = validateResgisterInput;