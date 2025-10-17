const EuropeTravelGuidePage = require("../../models/Pages/europeModel");

exports.getEuropeTravelGuide = async (req, res) => {
  try {
    const data = await EuropeTravelGuidePage.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEuropeTravelGuide = async (req, res) => {
  try {
    const newData = await EuropeTravelGuidePage.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEuropeTravelGuide = async (req, res) => {
  try {
    const updatedData = await EuropeTravelGuidePage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEuropeTravelGuide = async (req, res) => {
  try {
    await EuropeTravelGuidePage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Europe Travel Guide page deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
