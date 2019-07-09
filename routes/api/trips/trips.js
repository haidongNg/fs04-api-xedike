const { Trip } = require("../../../models/trip");
const { User } = require("../../../models/user");

//create trip
const createTrip = (req, res, next) => {
  // const { locationFrom, locationTo, startTime, availableSeats, free} = req.body;
  const driverId = req.user.id;
  User.findById(driverId)
    .then(driver => {
      if (!driver) return Promise.reject({ errors: "Error Driver" });
      const trip = { ...req.body, driverId };
      const newTrip = new Trip(trip);
      return newTrip.save();
    })
    .then(trip => res.status(200).json(trip))
    .catch(err => res.status(400).json(err));
};

// Async/await
// const bookTrip = async (req, res, next) => {
//     const {tripId} = req.params; // id trip
//     const {numberOfBookinhSeats} = req.body;
//     console.log(tripId)
//     const passengerId = req.user.id;
//     const passenger = await User.findById(passengerId);
//     const trip = await Trip.findById(tripId);

//     if(!passenger) return res.status(400).json({errors: 'passenger not found'});
//     if(!trip) return res.status(400).json({errors: 'trip not found'});
//     if(numberOfBookinhSeats > trip.availableSeats) return res.status(400).json({errors: 'Your book'})

//     trip.availableSeats -= numberOfBookinhSeats;
//     trip.passengerIDs.push(passengerId);
//     const savedTrip = await trip.save();
//     res.status(200).json(savedTrip)
// }

// Promise all

// Update thong tin chuyen di
const bookTrip = (req, res, next) => {
  const { tripId } = req.params; // id trip
  const { numberOfBookingSeats } = req.body;
  const passengerId = req.user.id;

  Promise.all([User.findById(passengerId), Trip.findById(tripId)])
    .then(results => {
      const passenger = results[0];
      const trip = results[1];

      if (!passenger) return Promise.reject({ errors: "passenger not found" });
      if (!trip) return Promise.reject({ errors: "trip not found" });
      if (numberOfBookingSeats > trip.availableSeats)
        return Promise.reject({ errors: "Your booking is over limitation" });

      trip.availableSeats -= numberOfBookingSeats;
      trip.passengerIDs.push(passengerId);
      return trip.save();
    })
    .then(trip => res.status(200).json(trip))
    .catch(err => res.status(400).json(err));
};

// route    GET /api/trips
// desc     lay danh sach trip
// access   PUBLIC

const getAllTrip = async (req, res, next) => {
  const allTrip = await Trip.find();
  if (!allTrip) return res.status(400).json({ error: "Not found" });
  res.status(200).json(allTrip);
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
  const { tripId } = req.params;
  await Trip.findByIdAndUpdate(tripId, req.body, { new: true }, (err, trip) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    res.status(200).json({ message: "success", trip });
  });
};

// route    POST /api/trip/cancel/:tripId
// desc     huy 1 chuyen di
// access   PRIVATE Passenger dang nhap moi co quyen access

const cancelBookTrip = async (req, res, next) => {
  const { tripId } = req.params;
  const { numberOfBookingSeats } = req.body;
  const passengerId = req.user.id;
  console.log(passengerId);
  const user = await User.findById(passengerId);
  const trip = await Trip.findById(tripId);

  if (!user) return res.status(400).json({ error: "User not found" });
  if (!trip) return res.status(400).json({ error: "Trip not found" });

  trip.availableSeats += Number(numberOfBookingSeats);
  const index = await trip.passengerIDs.findIndex(i => i === passengerId);
  if (index)
    return res.status(400).json({ error: "User not found PassengerIDs" });
  trip.passengerIDs.splice(index, 1);
  trip.save();
  return res.status(200).json(trip);
};

module.exports = {
  createTrip,
  bookTrip,
  getAllTrip,
  getTrip,
  deleteTrip,
  updateTrip,
  cancelBookTrip
};
