const express = require("express");
const {
  getSitemapLinks,
  addSitemapLink,
  updateSitemapLink,
  deleteSitemapLink,
} = require("../../controllers/Pages/sitemap.js");

const router = express.Router();

router.get("/", getSitemapLinks);
router.post("/", addSitemapLink);
router.put("/:id", updateSitemapLink);
router.delete("/:id", deleteSitemapLink);

module.exports = router;
