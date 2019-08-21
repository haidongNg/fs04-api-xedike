const { Driver } = require("../../../models/driver");
const { Car } = require("../../../models/car");
const { Trip } = require("../../../models/trip");
const { User } = require("../../../models/user");
const _ = require("lodash");
// route     POST /api/users/drivers/create-profile
// desc      tạo thông tin chi tiết cho một driver
// access    PRIVATE: chỉ có userType=driver mới được access
const createDriverProfile = async (req, res, next) => {
  const { address, passportId, mainJob } = req.body;
  const userId = req.user.id;

  const driver = await Driver.findOne({ userId: userId });
  if (driver)
    return res.status(400).json({ error: "Driver's profile existed" });
  const newDriver = new Driver({
    userId,
    address,
    passportId,
    mainJob
  });
  await newDriver
    .save()
    .then(dr => {
      res.status(200).json({ message: "Create driver profile successfully" });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

// route    PUT/POST /api/users/drivers/update-profile
// desc     lấy thông tin chi tiết của một tài xế
// access   PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access
const updateDriverProfile = async (req, res, next) => {
  const { id } = req.user;
  const { address, passportId, mainJob } = req.body;
  // await Driver.findOneAndUpdate(
  //   { _id: id },
  //   { $set: { address: address, passportId: passportId, mainJob: mainJob } },
  //   { useFindAndModify: false, new: true }, (err, driver) => {
  //     if(err) return res.status(400).json({ message: "Can't find driver profile" });
  //     if(driver) return res.status(200).json({ message: "Update driver profile successfully" });
  //   }
  // );
  const driver = await Driver.findOne({ userId: id });
  if (!driver)
    return res.status(400).json({ message: "Can't find driver profile" });
  driver.address = address;
  driver.passportId = passportId;
  driver.mainJob = mainJob;
  await driver
    .save()
    .then(dr => {
      return res
        .status(200)
        .json({ message: "Update driver profile successfully" });
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};
// route    GET /api/user/drivers/profile/:userId
// desc     lấy thông tin chi tiết của một tài xế
// access   PUBLIC (Tat ca nguoi dung deu co the access)
const getDriverProfile = async (req, res, next) => {
  const { userId } = req.params;
  const driver = await Driver.findOne({ userId: userId });
  if (!driver)
    return res.status(400).json({ error: "Can't find driver profile" });
  res.status(200).json(driver);
};

// route    DELETE/POST /api/users/drivers/delete-profile
// desc     delete profile của driver
// access   PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access
const deleteDriverProfile = async (req, res, next) => {
  const { id } = req.user;
  const driver = await Driver.findOne({ userId: id });
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

// route    GET /api/users/drivers/:driverId/cars
// desc     lấy danh sách xe hơi của một tài xế
// access   PUBLIC: tất cả mọi người dùng (kể cả người dùng vãng lai) đều có thể access

const getProfileCarById = async (req, res, next) => {
  const { driverId } = req.params;
  const driver = await Driver.findById(driverId, { carInfo: 1 });
  if (!driver) {
    res.status(400).json({ error: "Driver does not exsits" });
  }

  res.status(200).json({ message: "Driver carInfo successfully", driver });
};

// route    POST /api/users/drivers/add-car (POST)
// desc     Thêm xe hơi vào danh sách xe hơi của tài xế
// access   PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access

const addCarInfoDriver = async (req, res, next) => {
  const {
    brand,
    model,
    manufacturingYear,
    licensePlate,
    numberOfSeats
  } = req.body;
  const { id } = req.user;
  const driver = await Driver.findOne({ userId: id });
  if (!driver) return res.status(400).json({ error: "Driver does not exsits" });
  const newCarInfo = new Car({
    brand,
    model,
    manufacturingYear,
    licensePlate,
    numberOfSeats
  });
  await driver.carInfo.push(newCarInfo);
  await driver
    .save()
    .then(dr => {
      res.status(200).json({ message: "Add CarInfo driver successfully" });
    })
    .catch(err => res.status(400).json(err));
};

// route     POST/PUT /api/users/drivers/update-car/:carId
// desc      edit thông tin của xe hơi
// access    PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access

const updateCarInfoDriver = async (req, res, next) => {
  const { carId } = req.params;
  const {
    brand,
    model,
    manufacturingYear,
    licensePlate,
    numberOfSeats
  } = req.body;
  const { id } = req.user;
  await Driver.updateOne(
    { userId: id, "carInfo._id": carId },
    {
      $set: {
        "carInfo.$.brand": brand,
        "carInfo.$.model": model,
        "carInfo.$.manufacturingYear": manufacturingYear,
        "carInfo.$.licensePlate": licensePlate,
        "carInfo.$.numberOfSeats": numberOfSeats
      }
    }
  )
    .then(driver => {
      console.log(driver);
      res.status(200).json({ message: "Update CarInfo Driver successfully" });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

// route     POST/DELETE /api/users/drivers/delete-car/:carId
// desc      xóa xe hơi ra khỏi danh sách xe hơi của tài xế
// access    PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access

const deleteCarInfoDriver = async (req, res, next) => {
  const { carId } = req.params;
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) return res.status(400).json({ error: "User not found" });
  const driver = await Driver.updateOne(
    { userId: id },
    {
      $pull: { carInfo: { _id: carId } }
    }
  );
  if (!driver) return res.status(400).json({ err: "CarInfo does not exists" });
  res.status(200).json({ message: "Delete item in CarInfo successfully " });
};

// route     POST /api/users/drivers//upload-car/:carId
// desc      upload card
// access    PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access


const uploadCarImage = (req, res, next) => {
  const { id } = req.user;
  Driver.findOne({ userId: id })
    .then(driver => {
      if (!driver)
        return res.status(400).json({ error: "Can't find driver's profile" });
      const carId = req.params.carId;
      let carLocate;
      const carImage = req.file.path;
      let adjustedCar = driver.carInfo.find((car, index) => {
        carLocate = index;
        console.log(car);
        return car._id !== carId;
      });
      console.log(adjustedCar);
      if (!adjustedCar)
        return res.status(400).json({ error: "Cannot find car" });
      adjustedCar.carImage = carImage;
      driver.carInfo[carLocate] = adjustedCar;
      return driver.save();
    })
    .then(driver =>
      res.status(200).json(driver.carInfo[driver.carInfo.length - 1])
    )
    .catch(err => {
      res.status(400).json(err);
    });
};


// route     GET /api/users/drivers//getDriverUsers
// desc      lay thong tin userDriver
// access    PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access

const getDriverInfoUsers = async (req, res, next) => {
  const result = await Driver.find(
    {},
    { carInfo: 1, passengerRates: 1 }
  ).populate({
    path: "userId",
    model: User,
    select: "email phone fullName gender avatar isActive"
  });
  if (!result)
    return res.status(400).json({ message: "Cannot find User Driver" });
  return res.status(200).json(result);
};

const getTripDriver = async (req, res, next) => {
  const {userId} = req.params;
  Promise.all([Driver.findOne({ userId: userId }), Trip.find({driverId: userId})])
    .then(result => {
      const driver = result[0];
      const trips = result[1];
      if (!driver) return Promise.reject({ error: "User not found" });
      return trips;
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

module.exports = {
  createDriverProfile,
  updateDriverProfile,
  getDriverProfile,
  deleteDriverProfile,
  getProfileCarById,
  addCarInfoDriver,
  deleteCarInfoDriver,
  updateCarInfoDriver,
  uploadCarImage,
  getDriverInfoUsers,
  getTripDriver
};
