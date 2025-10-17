const express = require("express");
const {
  getStatements,
  createStatement,
  updateStatement,
  deleteStatement,
} = require("../../controllers/Pages/statement");

const router = express.Router();

router.get("/", getStatements);
router.post("/", createStatement);
router.put("/:id", updateStatement);
router.delete("/:id", deleteStatement);

module.exports = router;
