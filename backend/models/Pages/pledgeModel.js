const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }
});

const committeeMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  imageUrl: { type: String }
});

const ctaButtonSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String }
});

const sustainabilitySchema = new mongoose.Schema({
  hero: {
    imageUrl: { type: String, required: true },
    heading: { type: String, required: true }
  },
  introText: { type: String },
  currentActions: [cardSchema],
  committeeMembers: [committeeMemberSchema],
  pastProjects: [cardSchema],
  futurePlans: [cardSchema],
  ctaButtons: [ctaButtonSchema]
}, { timestamps: true });

module.exports = mongoose.model("Sustainability", sustainabilitySchema);
