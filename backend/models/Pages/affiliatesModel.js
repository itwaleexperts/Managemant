const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  heading: { type: String },
  content: { type: String }
}, { _id: false });

const affiliatesSchema = new mongoose.Schema({
  hero: {
    brand: { type: String, default: "easyHotel" },
    title: { type: String, default: "Affiliates" },
    subtitle: { type: String }
  },
  intro: { type: String },
  sections: [sectionSchema], 
  signup: {
    signupUrl: { type: String },      
    signupCode: { type: String },      
    programId: { type: String }        
  },
  paymentInfo: {
    currency: { type: String, default: "GBP" },
    paymentCycle: { type: String, default: "Monthly" }
  },
  contact: {
    email: { type: String, default: "affiliate@easyhotel.com" }
  }
}, { timestamps: true });

module.exports = mongoose.model("Affiliate", affiliatesSchema);
