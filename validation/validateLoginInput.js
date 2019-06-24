const validator = require('validator');
const _ = require('lodash');
const { User } = require('../models/user');


validateLoginInput = async (data) => {
    let errors = {};

    data.email = _.get(data, 'email', '');
    data.password = _.get(data, 'password');

    // email
    if (validator.isEmpty(data.email)) errors.email = 'Email is required';
    else if (!validator.isEmail(data.email)) errors.email = 'Email is valid';
    else {
        const user = await User.findOne({ email: data.email });
        if (!user) errors.email = 'Email not exists';
    }

    // password
    if (validator.isEmpty(data.password)) errors.password = 'Password is required';
    else if (!validator.isLength(data.password, { min: 6 })) errors = 'Password has is least 6 characters';


    return {
        isValid: _.isEmpty(errors), // neu la true thi errors {} nguoc lai errors {.....}
        errors
    }

}

module.exports = validateLoginInput;