const mongoose = require("mongoose");

const accessibilitySchema = new mongoose.Schema({
  title: { type: String, default: "Accessibility Statement" },
  intro: { type: String, required: true },
  digitalPolicy: {
    heading: { type: String },
    points: [{ type: String }]
  },
  limitations: {
    heading: { type: String },
    points: [{ type: String }]
  },
  compliance: { type: String },
  preparation: { type: String },
  contact: {
    email: { type: String },
    address: { type: String },
    phone: { type: String }
  },
  technicalSpec: [{ type: String }],
  focusAreas: [{ type: String }],
  commitment: { type: String },
  navigationTips: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Accessibility", accessibilitySchema);
