const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  img: { type: String, required: true },
});

const exploreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, 
    banner: { type: String},
    cities: [citySchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Explore", exploreSchema);
