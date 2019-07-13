const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  manufacturingYear: { type: Number, required: true },
  licensePlate: { type: String, required: true },
  numberOfSeats: { type: Number, required: true },
  carImage: { type: String, required: false }
});

const Car = mongoose.model("Card", CarSchema);

module.exports = {
  Car,
  CarSchema
};
