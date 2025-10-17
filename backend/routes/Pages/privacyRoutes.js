const express = require("express");
const { createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy } = require("../../controllers/Pages/privacy");

const router = express.Router();

router.post("/create", createPolicy);
router.get("/all", getAllPolicies);
router.get("/:id", getPolicyById);
router.put("/update/:id", updatePolicy);
router.delete("/delete/:id", deletePolicy);

module.exports = router;
