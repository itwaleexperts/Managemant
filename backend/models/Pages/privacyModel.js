const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema({
  lastUpdated: { type: String, required: true },
  introduction: { type: String, required: true },
  dataWeCollect: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  howWeUseData: [{ type: String, required: true }],
  legalRights: { type: String, required: true },
  contact: {
    email: { type: String, required: true },
    address: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("PrivacyPolicy", privacyPolicySchema);
