const express = require("express");
const router = express.Router();
const { getCorporateBooking, createCorporateBooking, updateCorporateBooking } = require("../../controllers/Pages/corporate");

router.get("/get", getCorporateBooking);
router.post("/create", createCorporateBooking);
router.put("/update/:id", updateCorporateBooking);

module.exports = router;
