const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  type: { type: String, enum: ["student", "graduate"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  buttonText: { type: String },
  link: { type: String },
  icon: { type: String } 
});

const studentDiscountPageSchema = new mongoose.Schema({
  heroImage: { type: String },
  headerText: { type: String },
  description: { type: String },
  discounts: [discountSchema],
  poweredBy: { type: String },
  helpCenterLink: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("StudentDiscountPage", studentDiscountPageSchema);
