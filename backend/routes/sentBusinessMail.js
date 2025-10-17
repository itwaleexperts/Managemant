const express = require("express");
const router = express.Router();
const { sendBusniessMali } = require("../controllers/sentBusinessMail");

router.post("/send-business-mail", sendBusniessMali);

module.exports = router;