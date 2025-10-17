const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  heroImage: { type: String, required: true },
  heroTitle: { type: String, required: true },

  introText: { type: String, required: true },

  fastFacts: [
    {
      icon: { type: String },
      title: { type: String },
    },
  ],

  sections: [
    {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      buttonText: { type: String, default: "Read more →" },
    },
  ],

  ctaCards: [
    {
      icon: { type: String },
      title: { type: String },
      buttonText: { type: String },
    },
  ],

  banner: {
    image: { type: String },
    text: { type: String },
  },
});

module.exports = mongoose.model("About", aboutSchema);
