const validator = require("validator");
const _ = require("lodash");

const validateCreateTrip = async data => {
  let errors = {};
  data.locationFrom = _.get(data, "locationFrom", "");
  data.locationTo = _.get(data, "locationTo", "");
  data.startTime = _.get(data, "startTime", "");
  data.availableSeats = _.get(data, "availableSeats", "");
  data.fee = _.get(data, "fee", "");

  if (validator.isEmpty(data.locationFrom))
    errors.locationFrom = "locationFrom is required";
  if (validator.isEmpty(data.locationTo))
    errors.locationTo = "locationTo is required";
  if (validator.isEmpty(data.startTime))
    errors.startTime = "startTime is required";
  if (validator.isEmpty(data.availableSeats))
    errors.availableSeats = "availableSeats is required";
  else if (!validator.isInt(data.availableSeats, {gt: 0, lt: 10}))
    errors.availableSeats = "Must be number";
  if (validator.isEmpty(data.fee)) errors.fee = "tree is required";
  else if (!validator.isNumeric(data.fee)) {
    errors.fee = "Must be number";
  }
  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

 const validateBookTrip = async data => {
  let errors = {};
  data.locationGetIn = _.get(data, "locationGetIn", "");
  data.locationGetOff = _.get(data, "locationGetOff", "");
  data.paymentMethod = _.get(data, "paymentMethod", "");
  data.numberOfBookingSeats = _.get(data, "numberOfBookingSeats", "");

  if (validator.isEmpty(data.locationGetIn))
    errors.locationFrom = "locationGetIn is required";
  if (validator.isEmpty(data.locationGetOff))
    errors.locationTo = "locationGetOff is required";
  if (validator.isEmpty(data.paymentMethod))
    errors.startTime = "paymentMethod is required";
  if (validator.isEmpty(data.numberOfBookingSeats))
    errors.numberOfBookingSeats = "numberOfBookingSeats is required";
  else if (!validator.isNumeric(data.numberOfBookingSeats))
    errors.numberOfBookingSeats = "Must be number";
  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

const validateUpdateTrip = async data => {
  let errors = {};
  data.locationFrom = _.get(data, "locationFrom", "");
  data.locationTo = _.get(data, "locationTo", "");
  data.startTime = _.get(data, "startTime", "");
  data.availableSeats = _.get(data, "availableSeats", "");
  data.fee = _.get(data, "fee", "");

  if (validator.isEmpty(data.locationFrom))
    errors.locationFrom = "locationFrom is required";

  if (validator.isEmpty(data.locationTo))
    errors.locationTo = "locationTo is required";
  if (validator.isEmpty(data.startTime))
    errors.startTime = "startTime is required";

  if (validator.isEmpty(data.availableSeats))
    errors.availableSeats = "availableSeats is required";
  else if (!validator.isNumeric(data.availableSeats))
    errors.availableSeats = "Must be number";
  else if (data.availableSeats < 1 || data.availableSeats > 10) {
    errors.availableSeats = "Booking seats min is 1 and max is 10";
  }

  if (validator.isEmpty(data.fee)) errors.fee = "fee is required";
  else if (!validator.isNumeric(data.fee)) {
    errors.fee = "Must be number";
  }

  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

module.exports = {
  validateCreateTrip,
  validateUpdateTrip,
  validateBookTrip
};
