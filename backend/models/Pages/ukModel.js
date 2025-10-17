const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  imageUrl: { type: String, trim: true },
  imageSeed: { type: String, trim: true },
  title: { type: String, trim: true, required: true },
  text: { type: String, required: true },
  imageOnLeft: { type: Boolean, default: true }
});

const GuideSchema = new mongoose.Schema({
  slug: { type: String, trim: true, required: true, unique: true },
  country: { type: String, trim: true, required: true },
  heroImage: { type: String, trim: true },
  heroSeed: { type: String, trim: true },
  tagline: { type: String, trim: true },
  intro: { type: String, trim: true },
  blocks: [BlockSchema],
  cta: {
    text: { type: String, trim: true },
    bgColor: { type: String, trim: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Guide", GuideSchema);
