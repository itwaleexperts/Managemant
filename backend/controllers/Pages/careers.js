const Career = require("../../models/Pages/careersModel");

const getCareerData = async (req, res) => {
  try {
    const data = await Career.findOne();
    if (!data) return res.status(404).json({ success: false, message: "Careers data not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCareerData = async (req, res) => {
  try {
    const exists = await Career.findOne();
    if (exists) return res.status(400).json({ success: false, message: "Career document already exists. Use update." });

    const doc = new Career(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateCareerData = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Career.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Career data not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCareerData = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Career.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: "Career data not found" });
    res.json({ success: true, message: "Career document deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCareerData, createCareerData, updateCareerData, deleteCareerData };
