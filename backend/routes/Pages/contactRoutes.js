const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, updateContact, deleteContact } = require("../../controllers/Pages/contactus");

router.post("/", createContact);          
router.get("/", getAllContacts);          
router.put("/:id", updateContact);        
router.delete("/:id", deleteContact);     

module.exports = router;
