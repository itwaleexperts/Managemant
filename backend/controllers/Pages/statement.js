const ModernSlavery = require("../../models/Pages/statementModel");

const getStatements = async (req, res) => {
  try {
    const data = await ModernSlavery.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStatement = async (req, res) => {
  try {
    const newSection = new ModernSlavery(req.body);
    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ModernSlavery.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Section not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ModernSlavery.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Section not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStatements,
  createStatement,
  updateStatement,
  deleteStatement,
};
