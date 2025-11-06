const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");

/* =========================================================
   📦 CREATE BOOKING (User books a package)
   ========================================================= */
exports.createBooking = async (req, res) => {
  try {
    const { packageId, date } = req.body;

    // Check if booking already exists for this user & package
    const existing = await Booking.findOne({
      userId: req.user.id,
      packageId,
    });

    if (existing) {
      return res.status(200).json({
        msg: "Booking already exists",
        booking: existing,
      });
    }

    // Create a new booking
    const booking = new Booking({
      userId: req.user.id,
      packageId,
      date: date || new Date(),
      status: "Pending",
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("❌ Booking creation failed:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   📋 GET MY BOOKINGS (Logged-in user's bookings)
   ========================================================= */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("packageId"); // Include package details

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   👑 ADMIN: GET ALL BOOKINGS
   ========================================================= */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email") // Only include user's name & email
      .populate("packageId", "name"); // Only include package name

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   ✏️ ADMIN: UPDATE BOOKING STATUS
   ========================================================= */
exports.updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   ❌ CANCEL BOOKING (User or Admin)
   ========================================================= */
exports.cancelBooking = async (req, res) => {
  try {
    let booking;

    if (req.user.role === "admin") {
      // Admin can cancel any booking
      booking = await Booking.findByIdAndDelete(req.params.id);
    } else {
      // User can only cancel their own booking
      booking = await Booking.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });
    }

    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or not authorized" });
    }

    res.json({ msg: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
