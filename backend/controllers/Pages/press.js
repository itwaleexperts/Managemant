const Press = require("../../models/Pages/pressModel");

exports.createPress = async (req, res) => {
  try {
    const newPress = new Press(req.body);
    await newPress.save();
    res.status(201).json({ success: true, data: newPress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllPress = async (req, res) => {
  try {
    const data = await Press.find();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPressById = async (req, res) => {
  try {
    const press = await Press.findById(req.params.id);
    if (!press) return res.status(404).json({ success: false, message: "Press not found" });
    res.json({ success: true, data: press });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePress = async (req, res) => {
  try {
    const updatedPress = await Press.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPress) return res.status(404).json({ success: false, message: "Press not found" });
    res.json({ success: true, data: updatedPress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePress = async (req, res) => {
  try {
    const deletedPress = await Press.findByIdAndDelete(req.params.id);
    if (!deletedPress) return res.status(404).json({ success: false, message: "Press not found" });
    res.json({ success: true, message: "Press entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
