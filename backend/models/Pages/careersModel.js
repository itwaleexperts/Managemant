const mongoose = require("mongoose");

const benefitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  img: { type: String }
}, { _id: false });

const opportunitySchema = new mongoose.Schema({
  role: { type: String, required: true },
  desc: { type: String },
  img: { type: String }
}, { _id: false });

const careersSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: "easyHotel Careers" },
    subtitle: { type: String }
  },
  intro: { type: String },
  benefits: [benefitSchema],
  peoplePillars: { type: String },
  testimonials: [testimonialSchema],
  opportunities: [opportunitySchema],
  vacancies: {
    locations: [String],
    defaultLocation: { type: String, default: "Select Location" }
  }
}, { timestamps: true });

module.exports = mongoose.model("Career", careersSchema);
