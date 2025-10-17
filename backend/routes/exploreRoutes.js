const express = require("express");
const router = express.Router();
const {
  addCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
} = require("../controllers/explore");
const uploadImagesMiddleware = require("../middlewares/uploadImageMiddleware");

router.post("/",uploadImagesMiddleware, addCountry);          
router.get("/", getAllCountries);      
router.get("/:id", getCountryById);    
router.put("/:id",uploadImagesMiddleware, updateCountry);    
router.delete("/:id", deleteCountry);  

module.exports = router;
