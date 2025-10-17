const express = require("express");
const {
  getTerms,
  getTermById,
  addTerm,
  updateTerm,
  deleteTerm,
} = require("../../controllers/Pages/terms");

const router = express.Router();

router.get("/", getTerms);            
router.get("/:id", getTermById);       
router.post("/", addTerm);             
router.put("/:id", updateTerm);      
router.delete("/:id", deleteTerm);   

module.exports = router;
