const Guide = require("../../models/Pages/ukModel");

const getGuides = async (req, res) => {
  try {
    const { slug } = req.query;
    if (slug) {
      const guide = await Guide.findOne({ slug: slug.toLowerCase() });
      if (!guide) return res.status(404).json({ message: "Guide not found" });
      return res.json(guide);
    }
    const list = await Guide.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createGuide = async (req, res) => {
  try {
    const payload = req.body;
    if (payload.slug) payload.slug = payload.slug.toLowerCase();
    const newGuide = new Guide(payload);
    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    Object.assign(guide, req.body);
    if (guide.slug) guide.slug = guide.slug.toLowerCase();
    await guide.save();
    res.json(guide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    await guide.deleteOne();
    res.json({ message: "Guide deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide
};
