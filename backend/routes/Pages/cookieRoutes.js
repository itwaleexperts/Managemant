const express = require("express");
const router = express.Router();
const { getCookiePolicy, createCookiePolicy, updateCookiePolicy } = require("../../controllers/Pages/cookiepolicy");

router.get("/get", getCookiePolicy);
router.post("/create", createCookiePolicy);
router.put("/update/:id", updateCookiePolicy);

module.exports = router;
