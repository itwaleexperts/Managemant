const express = require("express");
const router = express.Router();
const {
  getEuropeTravelGuide,
  createEuropeTravelGuide,
  updateEuropeTravelGuide,
  deleteEuropeTravelGuide
} = require("../../controllers/Pages/europe");

router.get("/get", getEuropeTravelGuide);
router.post("/create", createEuropeTravelGuide);
router.put("/update/:id", updateEuropeTravelGuide);
router.delete("/delete/:id", deleteEuropeTravelGuide);

module.exports = router;
