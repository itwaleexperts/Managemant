const mongoose = require("mongoose");

const digitalKeySchema = new mongoose.Schema({
  heroTitle: { type: String, required: true },
  heroImageUrls: [{ type: String, required: true }],
  introText: { type: String, required: true },
  features: [
    {
      iconName: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  setupGuide: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    extraInfo: [{ iconName: String, text: String }],
  },
  faq: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("DigitalKey", digitalKeySchema);
