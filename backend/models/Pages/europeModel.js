const mongoose = require("mongoose");

const guideSectionSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String },
  imageOnLeft: { type: Boolean, default: true },
});

const europeTravelGuideSchema = new mongoose.Schema({
  heroImage: { type: String },
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  guideSections: [guideSectionSchema],
  closingBannerText: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("EuropeTravelGuidePage", europeTravelGuideSchema);
