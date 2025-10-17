const CookiePolicy = require("../../models/Pages/cookieModel");

exports.getCookiePolicy = async (req, res) => {
  try {
    const data = await CookiePolicy.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCookiePolicy = async (req, res) => {
  try {
    const newPolicy = await CookiePolicy.create(req.body);
    res.status(201).json({ success: true, data: newPolicy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCookiePolicy = async (req, res) => {
  try {
    const updatedPolicy = await CookiePolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedPolicy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
