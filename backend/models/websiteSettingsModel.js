const mongoose = require("mongoose");

const WebsiteSettingsSchema = new mongoose.Schema({
  address: String,
  phone: String,
  email: String,
  bgImage: String, 
  images: [{ type: String }], 
  instagram: String,
  facebook : String,
  linkedIn : String,
  copyright: String,
  logo: String,
  footerText : String,
  footerHeading : String,
  workingHours: { type: String, default: "Mon-Sat 11:00 to 18:00" },
});

module.exports = mongoose.model("WebsiteSettings", WebsiteSettingsSchema);