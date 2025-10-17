const express = require("express");
const router = express.Router();
const {
  getClubBedzzzData,
  createClubBedzzzData,
  updateClubBedzzzData,
  deleteClubBedzzzData
} = require("../../controllers/Pages/clubedezz");

router.get("/", getClubBedzzzData);         
router.post("/", createClubBedzzzData);     
router.put("/:id", updateClubBedzzzData);     
router.delete("/:id", deleteClubBedzzzData);

module.exports = router;
