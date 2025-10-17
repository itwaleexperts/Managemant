const mongoose = require("mongoose");

const cookiePolicySchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Cookie Policy" },
  sections: [
    {
      heading: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("CookiePolicy", cookiePolicySchema);
