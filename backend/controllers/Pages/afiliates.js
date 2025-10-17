const Affiliate = require("../../models/Pages/affiliatesModel");

const getAffiliate = async (req, res) => {
  try {
    const data = await Affiliate.findOne();
    if (!data) return res.status(404).json({ success: false, message: "No affiliates data found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createAffiliate = async (req, res) => {
  try {
    const exists = await Affiliate.findOne();
    if (exists) {
      return res.status(400).json({ success: false, message: "Affiliates document already exists. Use update." });
    }
    const doc = new Affiliate(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateAffiliate = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Affiliate.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Affiliates data not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteAffiliate = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Affiliate.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: "Affiliates data not found" });
    res.json({ success: true, message: "Affiliates document deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAffiliate, createAffiliate, updateAffiliate, deleteAffiliate };
