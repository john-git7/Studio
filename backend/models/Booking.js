const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Completed"], default: "Pending" }
});

module.exports = mongoose.model("Booking", bookingSchema);
