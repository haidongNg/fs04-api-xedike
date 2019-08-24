const validator = require("validator");
const _ = require("lodash");

const validateDriverProfile = async data => {
  debugger;
  let errors = {};
  data.address = _.get(data, "address", "");
  data.passportId = _.get(data, "passportId", "");
  data.mainJob = _.get(data, "mainJob", "");

  if (validator.isEmpty(data.address)) errors.address = "address is required";
  if (validator.isEmpty(data.passportId))
    errors.passportId = "passportId is required";
  else if (validator.isLength(data.passportId, { min: 9, max: 9 }))
    errors.passportId = "passportId  has is least 9 number";
  if (validator.isEmpty(data.mainJob)) errors.mainJob = "mainJob is required";
  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

const validateCar = async data => {
  let errors = {};
  data.brand = _.get(data, "brand", "");
  data.model = _.get(data, "model", "");
  data.manufacturingYear = _.get(data, "manufacturingYear", "");
  data.licensePlate = _.get(data, "licensePlate", "");
  data.numberOfSeats = _.get(data, "numberOfSeats", "");

  if (validator.isEmpty(data.brand)) errors.brand = "brand is required";
  if (validator.isEmpty(data.model)) errors.model = "model is required";
  if (validator.isEmpty(data.manufacturingYear))
    errors.manufacturingYear = "manufacturingYear is required";
  else if (!validator.isNumeric(data.manufacturingYear))
    errors.manufacturingYear = "Must be number";
  if (validator.isEmpty(data.licensePlate))
    errors.licensePlate = "licensePlate is required";
  if (validator.isEmpty(data.numberOfSeats))
    errors.numberOfSeats = "numberOfSeats is required";
  else if (!validator.isNumeric(data.manufacturingYear))
    errors.numberOfSeats = "Must be number";
  return {
    isValid: _.isEmpty(errors),
    errors
  };
};

module.exports = {
  validateDriverProfile,
  validateCar
};
