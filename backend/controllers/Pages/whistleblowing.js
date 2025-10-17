const WhistleblowingPolicy = require("../../models/Pages/whistleblowingModel");

exports.createPolicy = async (req, res) => {
  try {
    const policy = new WhistleblowingPolicy(req.body);
    await policy.save();
    res.status(201).json({ message: "Policy created successfully", policy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await WhistleblowingPolicy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPolicyById = async (req, res) => {
  try {
    const policy = await WhistleblowingPolicy.findById(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const policy = await WhistleblowingPolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json({ message: "Policy updated", policy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const policy = await WhistleblowingPolicy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json({ message: "Policy deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
