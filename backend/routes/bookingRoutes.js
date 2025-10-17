const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  addBooking,
  updateBookingStatus,
} = require("../controllers/booking");
const verifyUserToken = require("../middlewares/verifyUserMiddleware");
const verifyAdminToken = require("../middlewares/verifyAdminMiddleware");


router.post("/", verifyUserToken,addBooking);
router.get("/", getAllBookings);     
router.get("/:id", getBookingById); 
// router.put("/:id",verifyUserToken, updateBooking);     
router.delete("/:id", deleteBooking);  
router.put("/:id",verifyAdminToken, updateBookingStatus);
module.exports = router;
