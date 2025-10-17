const mongoose=require("mongoose")
const sitemapSchema = new mongoose.Schema({
  column: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports=mongoose.model("Sitemap", sitemapSchema)
