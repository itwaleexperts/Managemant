const mongoose = require("mongoose");

const corporateBookingSchema = new mongoose.Schema({
  heroTitle: { type: String, required: true },
  heroImageUrl: { type: String, required: true },
  introText: { type: String, required: true },
  benefitChips: [
    {
      iconName: { type: String, required: true },
      text: { type: String, required: true },
    },
  ],
  topLocations: [
    {
      city: { type: String, required: true },
      country: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
  ],
  goodToKnow: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("CorporateBooking", corporateBookingSchema);
