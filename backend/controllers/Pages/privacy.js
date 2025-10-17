const PrivacyPolicy = require("../../models/Pages/privacyModel");

exports.createPolicy = async (req, res) => {
  try {
    const policy = new PrivacyPolicy(req.body);
    await policy.save();
    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.find();
    res.json({ success: true, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPolicyById = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findById(req.params.id);
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });
    res.json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const updated = await PrivacyPolicy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Policy not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const deleted = await PrivacyPolicy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Policy not found" });
    res.json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
