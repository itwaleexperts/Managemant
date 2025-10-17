const express = require("express");
const { 
  createHotel, 
  getHotel, 
  getOneHotel, 
  updateHotel, 
  deleteHotel, 
  getHotelsByCity, 
  searchByDestination,
  getCoordinates   
} = require("../controllers/hotel.js");

const uploadImagesMiddleware = require("../middlewares/uploadImageMiddleware.js");
const verifAdminToken = require("../middlewares/verifyAdminMiddleware.js");

const router = express.Router();

router.post("/create", uploadImagesMiddleware, verifAdminToken, createHotel);
router.get("/all", getHotel);
router.get("/one/:hotelId", getOneHotel);
router.put("/update/:hotelId", uploadImagesMiddleware, updateHotel);
router.delete("/delete/:hotelId", deleteHotel);

router.get("/search-by-destination", searchByDestination);
router.get("/", getHotelsByCity);

router.get("/geocode", getCoordinates);

module.exports = router;
