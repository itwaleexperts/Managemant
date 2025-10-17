const EasyHotelAppPage = require("../../models/Pages/easyhotelModel");

exports.getEasyHotelApp = async (req, res) => {
  try {
    const data = await EasyHotelAppPage.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEasyHotelApp = async (req, res) => {
  try {
    const newData = await EasyHotelAppPage.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEasyHotelApp = async (req, res) => {
  try {
    const updatedData = await EasyHotelAppPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEasyHotelApp = async (req, res) => {
  try {
    await EasyHotelAppPage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "EasyHotel App page data deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
