const Sustainability = require("../../models/Pages/pledgeModel");

exports.createSustainability = async (req, res) => {
  try {
    const newData = await Sustainability.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSustainability = async (req, res) => {
  try {
    const data = await Sustainability.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSustainabilityById = async (req, res) => {
  try {
    const data = await Sustainability.findById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateSustainability = async (req, res) => {
  try {
    const updated = await Sustainability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSustainability = async (req, res) => {
  try {
    await Sustainability.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
