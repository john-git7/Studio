const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  extras: [{ name: String, price: Number }]
});

module.exports = mongoose.model("Package", packageSchema);
