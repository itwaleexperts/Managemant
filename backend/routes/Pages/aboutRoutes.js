const express = require("express");
const { getAboutData, createAboutData, updateAboutData } =require("../../controllers/Pages/aboutus");
const uploadImagesMiddleware = require("../../middlewares/uploadImageMiddleware");
const router = express.Router();

router.get("/get", getAboutData);
router.post("/create", uploadImagesMiddleware,createAboutData);
router.put("/update/:id",uploadImagesMiddleware, updateAboutData); 

module.exports = router;
