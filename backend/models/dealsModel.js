const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  img: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  desc: { type: String, required: true, trim: true },
  btnText: { type: String, trim: true }
});

const extraSectionSchema = new mongoose.Schema({
  heading: { type: String, trim: true },
  subText: { type: String, trim: true },
  leftImage: { type: String, trim: true },
  leftTitle: { type: String, trim: true },
  leftDesc: { type: String, trim: true },
  leftBtnText: { type: String, trim: true },
  rightTitle: { type: String, trim: true },
  rightDesc: { type: String, trim: true },
  rightBtnText: { type: String, trim: true },
  rightImage: { type: String, trim: true }
});

const currentOfferSchema = new mongoose.Schema(
  {
    mainHeading: { type: String, required: true, trim: true },
    subHeading: { type: String, trim: true },
    offers: [offerSchema],      
    extraSection: extraSectionSchema 
  },
  { timestamps: true }
);

module.exports = mongoose.model("CurrentOffer", currentOfferSchema);
