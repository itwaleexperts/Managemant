const express = require("express");
const router = express.Router();
const {
  getLocations,
  createLocations,
  updateLocations,
  deleteLocations
} = require("../../controllers/Pages/developement");

router.get("/get", getLocations);
router.post("/create", createLocations);
router.put("/update/:id", updateLocations);
router.delete("/delete/:id", deleteLocations);

module.exports = router;
