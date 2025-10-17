const LocationsPage = require("../../models/Pages/developementModel");

exports.getLocations = async (req, res) => {
  try {
    const data = await LocationsPage.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createLocations = async (req, res) => {
  try {
    const newData = await LocationsPage.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLocations = async (req, res) => {
  try {
    const updatedData = await LocationsPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteLocations = async (req, res) => {
  try {
    await LocationsPage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Locations page data deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
