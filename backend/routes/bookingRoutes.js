const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBooking, cancelBooking    } = require("../controllers/bookingController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// User
router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.delete("/:id", authMiddleware, cancelBooking);

// Admin
router.get("/", authMiddleware, adminMiddleware, getAllBookings);
router.put("/:id", authMiddleware, adminMiddleware, updateBooking);
module.exports = router;
