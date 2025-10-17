const mongoose = require("mongoose");

const modernSlaverySchema = new mongoose.Schema({
  section: { type: String, required: true, trim: true }, 
  content: { type: String, required: true, trim: true },
  listItems: [{ type: String }] 
}, { timestamps: true });

const ModernSlavery = mongoose.model("ModernSlavery", modernSlaverySchema);

module.exports = ModernSlavery;
