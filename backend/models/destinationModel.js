const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  img: { type: String, required: true },
});

const destinationSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, trim: true },
    cities: [citySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
