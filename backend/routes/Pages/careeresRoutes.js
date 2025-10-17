const express = require("express");
const router = express.Router();
const {
  getCareerData,
  createCareerData,
  updateCareerData,
  deleteCareerData
} = require("../../controllers/Pages/careers");
const uploadImagesMiddleware = require("../../middlewares/uploadImageMiddleware");
router.get("/", getCareerData);      
router.post("/",uploadImagesMiddleware, createCareerData);      
router.put("/:id",uploadImagesMiddleware, updateCareerData);   
router.delete("/:id", deleteCareerData); 

module.exports = router;
