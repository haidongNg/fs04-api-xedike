const { Trip } = require('../../../models/trips');
const { User } = require('../../../models/user');


const createTrip = (req, res, next) => {
    // const { locationFrom, locationTo, startTime, availableSeats, free} = req.body;
    const driverId  = req.user.id;
    User.findById(driverId)
        .then(driver => {
            if(!driver) return Promise.reject({errors: 'Error Driver'});
            const trip = {...req.body, driverId}
            const newTrip = new Trip(trip);
            return newTrip.save();
        })
        .then(trip => res.status(200).json(trip))
        .catch(err => res.status(400).json(err))
}


const bookTrip = async (req, res, next) => {
    const {tripId} = req.params;
    console.log(tripId)
    const passengerId = req.user.id;
    const passenger = await User.findById(passengerId);
    const trip = await Trip.findById(tripId);

    if(!passenger) return res.status(400).json({errors: 'passenger not found'});
    if(!trip) return res.status(400).json({errors: 'trip not found'});
    
    trip.passengerIDs.push(passengerId);
    const savedTrip = await trip.save();
    res.status(200).json(savedTrip)
}

module.exports = {
    createTrip,
    bookTrip
}