const ClubBedzzz = require("../../models/Pages/clubedzzModel");

const getClubBedzzzData = async (req, res) => {
  try {
    const data = await ClubBedzzz.findOne();
    if (!data) return res.status(404).json({ success: false, message: "ClubBedzzz data not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createClubBedzzzData = async (req, res) => {
  try {
    const exists = await ClubBedzzz.findOne();
    if (exists) return res.status(400).json({ success: false, message: "ClubBedzzz data already exists. Use update." });

    const doc = new ClubBedzzz(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateClubBedzzzData = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ClubBedzzz.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "ClubBedzzz data not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteClubBedzzzData = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ClubBedzzz.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: "ClubBedzzz data not found" });
    res.json({ success: true, message: "ClubBedzzz document deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getClubBedzzzData, createClubBedzzzData, updateClubBedzzzData, deleteClubBedzzzData };
