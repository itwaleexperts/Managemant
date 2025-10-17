const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema({
  country: { type: String, required: true },
  hotelName: { type: String, required: true },
  highlight: { type: Boolean, default: false } 
}, { timestamps: true });

const Terms = mongoose.model("Terms", termsSchema);
module.exports = Terms;
