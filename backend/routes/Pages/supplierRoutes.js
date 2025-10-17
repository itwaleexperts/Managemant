const express = require("express");
const router = express.Router();
const {
  getSupplierData,
  createSupplierData,
  updateSupplierData,
  deleteSupplierData
} = require("../../controllers/Pages/supplier");

router.get("/", getSupplierData);             
router.post("/", createSupplierData);        
router.put("/:id", updateSupplierData);       
router.delete("/:id", deleteSupplierData);   

module.exports = router;
