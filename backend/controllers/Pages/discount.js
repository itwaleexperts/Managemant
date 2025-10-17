const StudentDiscountPage = require("../../models/Pages/discountModel");

exports.getStudentDiscount = async (req, res) => {
  try {
    const data = await StudentDiscountPage.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: 'No student discount data found' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createStudentDiscount = async (req, res) => {
  try {
    const newData = await StudentDiscountPage.create(req.body);
    res.status(201).json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStudentDiscount = async (req, res) => {
  try {
    const updatedData = await StudentDiscountPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStudentDiscount = async (req, res) => {
  try {
    await StudentDiscountPage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Student discount page data deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
