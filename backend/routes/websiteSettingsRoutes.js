const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  getSettings,
  updateSettings,
  deleteImage,
} = require("../controllers/websiteSettings.js");


// ---------------------------
// 🔧 Multer Middleware Setup
// ---------------------------
const uploadPath = path.join(__dirname, "../uploads");

// अगर uploads folder नहीं है तो बना दो
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// File Filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG, and WEBP images are allowed"), false);
  }
};

// Multer Config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB per file
});

// ✅ Custom middleware (logo + bgImage + carouselImages)
const uploadWebsiteSettings = (req, res, next) => {
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bgImage", maxCount: 1 },
    { name: "carouselImages", maxCount: 5 },
  ])(req, res, (err) => {
    if (err) {
      let errorMsg = err.message;
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMsg = "Each image must be under 5MB";
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        errorMsg = "Unexpected file or too many uploads";
      }

      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: errorMsg,
      });
    }

    // Ensure safe structure
    if (!req.files) req.files = {};
    if (!req.files.logo) req.files.logo = [];
    if (!req.files.bgImage) req.files.bgImage = [];
    if (!req.files.carouselImages) req.files.carouselImages = [];

    console.log("Uploaded Files:", {
      logo: req.files.logo.length,
      bgImage: req.files.bgImage.length,
      carouselImages: req.files.carouselImages.length,
    });

    next();
  });
};

// ---------------------------
// 🔗 Routes
// ---------------------------

router.get("/", getSettings);

// ✅ अब यह middleware यहीं define किया गया है
router.put("/", uploadWebsiteSettings, updateSettings);

router.delete("/image", deleteImage);

module.exports = router;
