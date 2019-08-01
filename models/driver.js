const mongoose = require("mongoose");
const { CarSchema } = require("./car");
const DriverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  address: { type: String, required: true },
  passportId: { type: String, required: true },
  mainJob: { type: String, required: true },
  carInfo: [{ type: CarSchema }],
  passengerRates: [
    {
      type: Number,
      required: false
    }
  ]
});

const Driver = mongoose.model("Driver", DriverSchema);
module.exports = {
  Driver,
  DriverSchema
};
