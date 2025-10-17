const express = require("express");
const router = express.Router();
const {
  getStudentDiscount,
  createStudentDiscount,
  updateStudentDiscount,
  deleteStudentDiscount
} = require("../../controllers/Pages/discount");

router.get("/get", getStudentDiscount);
router.post("/create", createStudentDiscount);
router.put("/update/:id", updateStudentDiscount);
router.delete("/delete/:id", deleteStudentDiscount);

module.exports = router;
