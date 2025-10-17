const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String },
  imageUrl: { type: String },
  type: { type: String, enum: ["open", "development"], default: "open" }
});

const boardSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  buttonText: { type: String }
});

const statsSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String }
});

const locationsPageSchema = new mongoose.Schema({
  heroImage: { type: String },
  heroTitle: { type: String },
  heroDescription: { type: String },
  bookingForm: { type: Object }, 
  overviewText: { type: String },
  stats: [statsSchema],
  openHotels: [hotelSchema],
  underDevelopmentHotels: [hotelSchema],
  boardOfDirectors: boardSchema,
  smallTextSections: [String],
  shareholderSection: boardSchema,
}, { timestamps: true });

module.exports = mongoose.model("LocationsPage", locationsPageSchema);
