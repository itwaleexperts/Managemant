const express = require("express");
const router = express.Router();
const {
  addDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} = require("../controllers/destination");
const uploadImagesMiddleware = require("../middlewares/uploadImageMiddleware");

router.post("/",uploadImagesMiddleware, addDestination);            
router.get("/", getAllDestinations);         
router.get("/:id", getDestinationById);     
router.put("/:id", uploadImagesMiddleware,updateDestination);       
router.delete("/:id", deleteDestination);    

module.exports = router;
