const express = require("express");
const {
  getAccessibility,
  createAccessibility,
  updateAccessibility,
  deleteAccessibility
} = require("../../controllers/Pages/accessbility");

const router = express.Router();

router.get("/get", getAccessibility);
router.post("/create", createAccessibility);
router.put("/update/:id", updateAccessibility);
router.delete("/delete/:id", deleteAccessibility);

module.exports = router;
