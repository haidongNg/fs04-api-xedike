const { Trip } = require("../../../models/trip");
const { User } = require("../../../models/user");
const { Driver } = require("../../../models/driver");
const {
  validateCreateTrip,
  validateBookTrip,
  validateUpdateTrip
} = require("../../../validation/validate-trips");

//create trip
const createTrip = async (req, res, next) => {
  const { isValid, errors } = await validateCreateTrip(req.body);
  // const { locationFrom, locationTo, startTime, availableSeats, free} = req.body;
  if (!isValid) return res.status(400).json(errors);
  const driverId = req.user.id;
  User.findById(driverId, { fullName: 1 })
    .then(driver => {
      if (!driver) return Promise.reject({ errors: "Error Driver" });
      const trip = { ...req.body, driverId };
      const newTrip = new Trip(trip);
      return newTrip.save();
    })
    .then(trip => {
      res.status(200).json(trip);
    })
    .catch(err => res.status(400).json(err));
};

// Async/await
const bookTrip = async (req, res, next) => {
  const { isValid, errors } = await validateBookTrip(req.body);
  if (!isValid) return res.status(400).json(errors);
  const { tripId } = req.params; // id trip
  const {
    locationGetIn,
    locationGetOff,
    paymentMethod,
    numberOfBookingSeats,
    notes
  } = req.body;
  console.log(tripId);
  const passengerId = req.user.id;
  const passenger = await User.findById(passengerId);
  const trip = await Trip.findById(tripId);

  if (!passenger)
    return res.status(400).json({ errors: "passenger not found" });
  if (!trip) return res.status(400).json({ errors: "trip not found" });
  if (numberOfBookingSeats > trip.availableSeats){
    errors.numberOfBookingSeats = "numberOfBookingSeats not greater than availableSeats"
    return res.status(400).json(errors)};

  trip.availableSeats -= numberOfBookingSeats;
  const newTripPassenger = {
    passengerId,
    locationGetIn,
    locationGetOff,
    paymentMethod,
    numberOfBookingSeats,
    notes
  };
  trip.passengers = [...trip.passengers, newTripPassenger];
  // trip.passengerIDs.push(passengerId);
  const savedTrip = await trip.save();
  res.status(200).json(savedTrip);
};

// Promise all

// Update thong tin chuyen di
// const bookTrip = (req, res, next) => {
//   const { tripId } = req.params; // id trip
//   const { numberOfBookingSeats } = req.body;
//   const passengerId = req.user.id;

//   Promise.all([User.findById(passengerId), Trip.findById(tripId)])
//     .then(results => {
//       const passenger = results[0];
//       const trip = results[1];

//       if (!passenger) return Promise.reject({ errors: "passenger not found" });
//       if (!trip) return Promise.reject({ errors: "trip not found" });
//       if (numberOfBookingSeats > trip.availableSeats)
//         return Promise.reject({ errors: "Your booking is over limitation" });

//       trip.availableSeats -= numberOfBookingSeats;
//       trip.passengerIDs.push(passengerId);
//       return trip.save();
//     })
//     .then(trip => res.status(200).json(trip))
//     .catch(err => res.status(400).json(err));
// };

// route    GET /api/trips
// desc     lay danh sach trip
// access   PUBLIC

const getTrips = async (req, res, next) => {
  Promise.all([
    Trip.find(
      { isFinished: { $eq: false } },
      {
        availableSeats: 1,
        locationFrom: 1,
        locationTo: 1,
        fee: 1,
        startTime: 1,
        driverId: 1,
        isFinished: 1
      }
    ),
    Driver.find({}, { carInfo: 1, passengerRates: 1, userId: 1 }).populate({
      path: "userId",
      model: User,
      select: "email phone fullName gender avatar isActive"
    })
  ])
    .then(results => {
      const trips = results[0];
      const drivers = results[1];
      const data = [];
      if (!trips)
        return res.status(400).json({ error: "List Trips Not found" });
      trips.map(trip => {
        const driver = drivers.find(
          d => d.userId._id.toString() === trip.driverId.toString()
        );
        if (driver) {
          data.push({ trip, driver });
        }
      });
      return data;
    })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
};

// route    GET /api/trip/:tripId
// desc     lay 1 trip
// access   PUBLIC

const getTrip = async (req, res, next) => {
  const { tripId } = req.params;
  const trip = await Trip.findById(tripId);

  if (!trip) return res.status(400).json({ error: "Not found" });

  res.status(200).json(trip);
};

// route    DELETE /api/trip/:tripId
// desc     delete trip
// access   PRIVATE Driver dang nhap moi co quyen access

const deleteTrip = async (req, res, next) => {
  const { tripId } = req.params;
  await Trip.findByIdAndDelete(tripId, (err, trip) => {
    if (err) return res.status(400).json(err);
    res.status(200).json({ message: "success" });
  });
};

// route    PUT /api/trip/:tripId
// desc     update trip
// access   PRIVATE Driver dang nhap moi co quyen access

const updateTrip = async (req, res, next) => {
  const { isValid, errors } = await validateUpdateTrip(req.body);
  if (!isValid) return res.status(400).json(errors);
  const { tripId } = req.params;
  const { locationFrom, locationTo, startTime, availableSeats, fee } = req.body;
  await Trip.findByIdAndUpdate(
    tripId,
    { locationFrom, locationTo, startTime, availableSeats, fee },
    { new: true },
    (err, trip) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json({ message: "success", trip });
    }
  );
};

// route    POST /api/trip/cancel/:tripId
// desc     huy 1 chuyen di
// access   PRIVATE Passenger dang nhap moi co quyen access

const cancelBookTrip = (req, res, next) => {
  const { tripId } = req.params;
  const passengerId = req.user.id;
  Promise.all([User.findById(passengerId), Trip.findById(tripId)])
    .then(results => {
      debugger
      const user = results[0];
      const trip = results[1];
      if (!user) return res.status(400).json({ error: "User not found" });
      if (!trip) return res.status(400).json({ error: "Trip not found" });

      const item = trip.passengers.find(
        u => u.passengerId.toString() === passengerId.toString()
      );
      if (!item) return res.status(400).json({ error: "Not found" });
      if (item.numberOfBookingSeats > trip.numberOfBookingSeats)
        return res.status(400).json("Number of booking trip not found");
      trip.availableSeats += Number(item.numberOfBookingSeats);
      const index = trip.passengers.findIndex(
        i => i.passengerId.toString() === passengerId.toString()
      );
      trip.passengers.splice(index, 1);
      return trip.save();
    })
    .then(trip => {
      res.status(200).json({ message: "success" });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

// route    POST /api/trip/finish/:tripId
// desc      Driver kết thúc một chuyến đi
// access   PRIVATE: chỉ có userType=driver + đang đăng nhập mới được access

const finishTheTrip = async (req, res, next) => {
  const { tripId } = req.params;
  Trip.findById(tripId)
    .then(trip => {
      if (!trip) return res.status(400).json({ error: "Trip does not exists" });
      trip.isFinished = true;
      return trip.save();
    })
    .then(trip => res.status(200).json({ message: "Finish the trip" }))
    .catch(err => {
      res.status(400).json(err);
    });
};

// route    POST /api/trips/rates/:tripId
// desc     user (passenger) đánh giá về tài xế
// access   PRIVATE: chỉ có userType=passenger + đang đăng nhập mới được access

const ratesTrip = async (req, res, next) => {
  const { tripId } = req.params;
  const { passengerRates } = req.body;
  const trip = await Trip.findById(tripId);
  if (!trip) return res.status(400).json({ error: "Cannot evaluate trip" });
  const driver = await Driver.findOne({ userId: trip.driverId });
  if (!driver) return res.status(400).json({ error: "Driver does not exists" });

  await driver.passengerRates.push(passengerRates);
  await driver.save();
  res.status(200).json({ message: "Rate driver successfully" });
};

module.exports = {
  createTrip,
  bookTrip,
  getTrips,
  getTrip,
  deleteTrip,
  updateTrip,
  cancelBookTrip,
  finishTheTrip,
  ratesTrip
};
