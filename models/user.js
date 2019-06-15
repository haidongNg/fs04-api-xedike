const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fullName: {type: String, required: true},
    userType: {type: String, required: true}, // tai xe or hang khach
    phone: {type: Number, required: true, unique: true},
    dateOfBirth: {type: Date, required: true},
    registerDate: {
        type: Date, default: new Date().getTime()
    },
    numberOfTrips: {type: Number},
    numbeOfKms: {type: Number},
    avatar: {type: String},
    isActive: { type: Boolean, default: true},
});


const User = mongoose.model('User', UserSchema);
module.exports = {
    UserSchema, User
}