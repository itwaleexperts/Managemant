const SupplierCodeOfConduct = require("../../models/Pages/supplierModel");

const getSupplierData = async (req, res) => {
  try {
    const data = await SupplierCodeOfConduct.findOne();
    if (!data) return res.status(404).json({ success: false, message: "Data not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createSupplierData = async (req, res) => {
  try {
    const exists = await SupplierCodeOfConduct.findOne();
    if (exists) return res.status(400).json({ success: false, message: "Data already exists. Use update instead." });

    const doc = new SupplierCodeOfConduct(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateSupplierData = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SupplierCodeOfConduct.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Data not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteSupplierData = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await SupplierCodeOfConduct.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: "Data not found" });
    res.json({ success: true, message: "Supplier Code of Conduct deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSupplierData, createSupplierData, updateSupplierData, deleteSupplierData };
