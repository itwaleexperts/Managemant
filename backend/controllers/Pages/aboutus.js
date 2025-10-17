const About = require("../../models/Pages/aboutModel");

const getAboutData = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ success: false, message: "No data found" });
    }
    res.json({ success: true, data: about });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createAboutData = async (req, res) => {
  try {
 const uploadedFiles = req.files || [];
const heroImage = uploadedFiles[0] ? `/uploads/${uploadedFiles[0].filename}` : "";
const bannerImage = uploadedFiles[1] ? `/uploads/${uploadedFiles[1].filename}` : "";

const about = new About({
  ...req.body,
  heroImage,
  banner: { ...req.body.banner, image: bannerImage },
});


    await about.save();
    res.status(201).json({ success: true, data: about });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateAboutData = async (req, res) => {
  try {
    const { id } = req.params;

    const heroImage = req.files.find(f => f.fieldname === "heroImage")?.filename;
    const bannerImage = req.files.find(f => f.fieldname === "bannerImage")?.filename;

    const updatedData = {
      ...req.body,
      ...(heroImage && { heroImage: `/uploads/${heroImage}` }),
      banner: {
        ...req.body.banner,
        ...(bannerImage && { image: `/uploads/${bannerImage}` }),
      },
    };

    const about = await About.findByIdAndUpdate(id, updatedData, { new: true });
    if (!about) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }

    res.json({ success: true, data: about });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getAboutData, createAboutData, updateAboutData };
