const express = require("express");
const { createPress, getAllPress, getPressById, updatePress, deletePress } = require("../../controllers/Pages/press");

const router = express.Router();

router.post("/create", createPress);
router.get("/all", getAllPress);
router.get("/:id", getPressById);
router.put("/update/:id", updatePress);
router.delete("/delete/:id", deletePress);

module.exports = router;
