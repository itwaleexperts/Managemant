const express = require("express");
const router = express.Router();
const {
  getAffiliate,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate
} = require("../../controllers/Pages/afiliates");

router.get("/", getAffiliate);            
router.post("/", createAffiliate);       
router.put("/:id", updateAffiliate);   
router.delete("/:id", deleteAffiliate);  

module.exports = router;
