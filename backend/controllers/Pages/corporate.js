const CorporateBooking = require("../../models/Pages/corporateModel");

exports.getCorporateBooking = async (req, res) => {
  try {
    const data = await CorporateBooking.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCorporateBooking = async (req, res) => {
  try {
    const newData = await CorporateBooking.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCorporateBooking = async (req, res) => {
  try {
    const updatedData = await CorporateBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
