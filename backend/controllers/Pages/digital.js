const DigitalKey = require("../../models/Pages/digitalModel");

exports.getDigitalKey = async (req, res) => {
  try {
    const data = await DigitalKey.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDigitalKey = async (req, res) => {
  try {
    const newData = await DigitalKey.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDigitalKey = async (req, res) => {
  try {
    const updatedData = await DigitalKey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDigitalKey = async (req, res) => {
  try {
    await DigitalKey.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "DigitalKey page data deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
