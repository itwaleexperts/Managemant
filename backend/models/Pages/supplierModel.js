const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false });

const supplierSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String }
  },
  introduction: { type: String, required: true },
  sections: [sectionSchema],
  footerMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("SupplierCodeOfConduct", supplierSchema);
