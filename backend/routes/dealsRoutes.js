const express = require("express");
const router = express.Router();
const controller = require("../controllers/deals");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const offerUploadFields = upload.fields([
  { name: "offerImages", maxCount: 5 }, 
  { name: "leftImage", maxCount: 1 },   
  { name: "rightImage", maxCount: 1 },  
]);

router.post("/", offerUploadFields, controller.createOfferPage);
router.get("/", controller.getAllOfferPages);
router.get("/:id", controller.getOfferPageById);
router.put("/:id", offerUploadFields, controller.updateOfferPage);
router.delete("/:id", controller.deleteOfferPage);

module.exports = router;

