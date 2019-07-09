const { Driver } = require("../../../models/driver");
const { Car } = require("../../../models/car");
const createDriverProfile = async (req, res, next) => {
  const {
    address,
    passportId,
    mainJob,
    brand,
    model,
    manufacturingYear,
    licensePlate,
    numberOfSeats
  } = req.body;
  const userId = req.user.id;

  const driver = await Driver.findById(userId);
  console.log(driver);
  if (driver)
    return res.status(400).json({ error: "Driver's profile existed" });
  const newCarInfo = new Car({
    brand,
    model,
    manufacturingYear,
    licensePlate,
    numberOfSeats
  });
  const newDriver = new Driver({
    userId,
    address,
    passportId,
    mainJob,
    newCarInfo
  });
  await newDriver
    .save()
    .then(dr => {
      res
        .status(200)
        .json({ message: "Create driver profile successfully", dr });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

const getDriverProfile = async (req, res, next) => {
  const { driverId } = req.params;
  const driver = await Driver.findById(driverId);
  if(!driver) return res.status(400).json({error: "Can't find driver profile"});
  res.status(200).json(driver);
}

const deleteDriverProfile = async (req, res, next) => {
  const { driverId } = req.params;
  const driver = await Driver.findById(driverId);
  if (!driver)
    return res.status(400).json({ error: "Cant't find driver profile" });
  await driver
    .remove()
    .then(dr => {
      res.status(200).json({ message: "Delete Driver profile successfully" });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

module.exports = {
  createDriverProfile,
  getDriverProfile,
  deleteDriverProfile,
};
