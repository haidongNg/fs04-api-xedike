const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  locationFrom: { type: String, required: true },
  locationTo: { type: String, required: true },
  startTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  passengers: [
    {
      passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      locationGetIn: { type: String, required: false },
      locationGetOff: { type: String, required: false },
      paymentMethod: { type: String, required: false },
      numberOfBookingSeats: { type: Number, required: true },
      notes: { type: String, required: false }
    }
  ],
  free: { type: Number, required: true },
  isFinished: { type: Boolean, required: false }
});

const Trip = mongoose.model("Trip", TripSchema);
module.exports = {
  Trip,
  TripSchema
};
