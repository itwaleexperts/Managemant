const Accessibility = require("../../models/Pages/accessbilityModel");

const getAccessibility = async (req, res) => {
  try {
    const data = await Accessibility.findOne();
    if (!data) return res.status(404).json({ success: false, message: "No data found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createAccessibility = async (req, res) => {
  try {
    const data = new Accessibility(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateAccessibility = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Accessibility.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) return res.status(404).json({ success: false, message: "Data not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

  const deleteAccessibility = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Accessibility.findByIdAndDelete(id);
    if (!data) return res.status(404).json({ success: false, message: "Data not found" });
    res.json({ success: true, message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAccessibility, createAccessibility, updateAccessibility, deleteAccessibility };
