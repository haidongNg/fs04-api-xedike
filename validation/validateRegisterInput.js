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
    data.fullName = _.get(data, 'fullName', '');
    data.userType = _.get(data, 'userType', '');
    data.dateOfBirth = _.get(data, 'dateOfBirth', '');
    data.phone = _.get(data, 'phone', '');


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
    else if (validator.isLength(data.password, { min: 6 })) errors.password = 'Password has is least 6 characters';

    // password2
    if (validator.isEmpty(data.password2)) errors.password2 = 'Password is required';
    else if (validator.equals(data.password, data.password2)) errors.password2 = 'Password is not match';


    if (validator.isEmpty(data.phone)) errors.phone = 'Phone is required';
    else {
        const user = await User.findOne({ phone: data.phone });
        if (user) errors.phone = 'Phone exists';
    }
    // if(validator.isEmpty(data.fullName)) errors.fullName = 'FullName is required';
    // else if(validator.)
    return {
        // isValid: true neu errors la {}; isValid: false khi erros co thuoc tinh
        isValid: _.isEmpty(errors),
        errors
    }
}

module.exports = validateResgisterInput;