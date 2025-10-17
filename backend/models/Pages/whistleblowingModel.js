const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  heading: { type: String, required: true, trim: true },
  content: { type: String, trim: true },
  listItems: [{ type: String }]
});

const whistleblowingPolicySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Whistleblowing Policy" },
    sections: [sectionSchema],
    policyOwner: { type: String, trim: true },
    reviewDate: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhistleblowingPolicy", whistleblowingPolicySchema);
