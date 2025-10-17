const mongoose = require("mongoose");

const benefitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
}, { _id: false });

const clubBedzzzSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String },
    img: { type: String }
  },
  intro: { type: String },
  valueProposition: { type: String },
  membershipBenefits: [benefitSchema],
  howItWorks: { type: String },
  disclaimer: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("ClubBedzzz", clubBedzzzSchema);
