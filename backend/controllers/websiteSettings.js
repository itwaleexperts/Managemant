const WebsiteSettings = require("../models/websiteSettingsModel");
const fs = require("fs");
const path = require("path");

// ===============================
// 🟢 Get Website Settings
// ===============================
exports.getSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create({});
    }

    // Filter empty images
    settings.images = settings.images.filter((img) => img);

    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    console.error("Error getting settings:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// 🟡 Update Website Settings
// ===============================
exports.updateSettings = async (req, res) => {
  try {
    const {
      phone,
      email,
      instagram,
      facebook,
      linkedIn,
      copyright,
      workingHours,
      address,
      footerText,
      footerHeading,
    } = req.body;

    let settings = await WebsiteSettings.findOne();
    if (!settings) settings = new WebsiteSettings();

    // ----------------------------
    // Handle uploaded files
    // ----------------------------
    if (req.files) {
      // ✅ Logo
      if (req.files.logo && req.files.logo[0]) {
        if (settings.logo) {
          const oldPath = path.join(__dirname, "../uploads", path.basename(settings.logo));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        settings.logo = `/uploads/${req.files.logo[0].filename}`;
      }

      // ✅ Background Image
      if (req.files.bgImage && req.files.bgImage[0]) {
        if (settings.bgImage) {
          const oldPath = path.join(__dirname, "../uploads", path.basename(settings.bgImage));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        settings.bgImage = `/uploads/${req.files.bgImage[0].filename}`;
      }

      // ✅ Carousel Images (Multiple)
      if (req.files.carouselImages && req.files.carouselImages.length > 0) {
        const newImages = req.files.carouselImages.map((f) => `/uploads/${f.filename}`);
        settings.images = [...(settings.images || []), ...newImages].filter((img) => img);
      }
    }

    // ----------------------------
    // Update text fields
    // ----------------------------
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (instagram !== undefined) settings.instagram = instagram;
    if (facebook !== undefined) settings.facebook = facebook;
    if (linkedIn !== undefined) settings.linkedIn = linkedIn;
    if (copyright !== undefined) settings.copyright = copyright;
    if (workingHours !== undefined) settings.workingHours = workingHours;
    if (address !== undefined) settings.address = address;
    if (footerText !== undefined) settings.footerText = footerText;
    if (footerHeading !== undefined) settings.footerHeading = footerHeading;

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// 🔴 Delete Image (Logo / BG / Carousel)
// ===============================
exports.deleteImage = async (req, res) => {
  try {
    const { type, imagePath } = req.body;

    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    const uploadDir = path.join(__dirname, "../uploads");

    // ✅ Delete Logo
    if (type === "logo" && settings.logo) {
      const filePath = path.join(uploadDir, path.basename(settings.logo));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      settings.logo = "";
    }

    // ✅ Delete Background Image
    else if (type === "bgImage" && settings.bgImage) {
      const filePath = path.join(uploadDir, path.basename(settings.bgImage));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      settings.bgImage = "";
    }

    // ✅ Delete Carousel Image
    else if (type === "images" && imagePath && settings.images.includes(imagePath)) {
      const filePath = path.join(uploadDir, path.basename(imagePath));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      settings.images = settings.images.filter((img) => img !== imagePath);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type or image not found",
      });
    }

    await settings.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: settings,
    });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
