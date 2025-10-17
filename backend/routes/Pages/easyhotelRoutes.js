const express = require("express");
const router = express.Router();
const {
  getEasyHotelApp,
  createEasyHotelApp,
  updateEasyHotelApp,
  deleteEasyHotelApp
} = require("../../controllers/Pages/easyhotel");

router.get("/get", getEasyHotelApp);
router.post("/create", createEasyHotelApp);
router.put("/update/:id", updateEasyHotelApp);
router.delete("/delete/:id", deleteEasyHotelApp);

module.exports = router;
