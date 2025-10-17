const express = require("express");
const router = express.Router();
const {
  getDigitalKey,
  createDigitalKey,
  updateDigitalKey,
  deleteDigitalKey
} = require("../../controllers/Pages/digital");

router.get("/get", getDigitalKey);
router.post("/create", createDigitalKey);
router.put("/update/:id", updateDigitalKey);
router.delete("/delete/:id", deleteDigitalKey);

module.exports = router;
