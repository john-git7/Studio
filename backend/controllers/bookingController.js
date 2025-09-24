const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");

// User books a package
exports.createBooking = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const packageData = await Package.findById(req.body.packageId);

    const booking = new Booking({
      userId: req.user.id,
      packageId: req.body.packageId,
      date: req.body.date,
    });
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate("packageId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")   // populate only name & email
      .populate("packageId", "name");     // populate only package name
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Admin: Update booking status
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

// User: Cancel own booking
// Cancel booking (user or admin)
exports.cancelBooking = async (req, res) => {
  try {
    let booking;
    if (req.user.role === "admin") {
      booking = await Booking.findByIdAndDelete(req.params.id);
    } else {
      booking = await Booking.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });
    }

    if (!booking) {
      return res.status(404).json({ error: "Booking not found or not authorized" });
    }

    res.json({ msg: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




