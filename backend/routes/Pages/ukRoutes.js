const express = require("express");
const {
  getGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide
} = require("../../controllers/Pages/uk");

const router = express.Router();

router.get("/", getGuides);
router.get("/:id", getGuideById);
router.post("/", createGuide);
router.put("/:id", updateGuide);
router.delete("/:id", deleteGuide);

module.exports = router;
