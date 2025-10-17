const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, required: true },
});

const monthSchema = new mongoose.Schema({
  month: { type: String, required: true },
  articles: [articleSchema],
});

const pressSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  months: [monthSchema],
});

module.exports = mongoose.model("Press", pressSchema);
