const mongoose = require("mongoose");

const featureCardSchema = new mongoose.Schema({
  icon: { type: String, required: true }, 
  title: { type: String, required: true },
  description: { type: String },
});

const easyHotelAppSchema = new mongoose.Schema({
  heroImage: { type: String },
  heading: { type: String },
  subHeading: { type: String },
  googlePlayLink: { type: String },
  appStoreLink: { type: String },
  features: [featureCardSchema],
}, { timestamps: true });

module.exports = mongoose.model("EasyHotelAppPage", easyHotelAppSchema);
