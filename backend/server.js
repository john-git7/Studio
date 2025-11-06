// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Stripe = require("stripe");

// Models
const Booking = require("./models/Booking");
const Package = require("./models/Package");
const User = require("./models/User");

// Routes
const packageRoutes = require("./routes/packageroutes");
const bookingRoutes = require("./routes/bookingroutes"); // create this
const authRoutes = require("./routes/authroutes"); // create this for login/register

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes); // login/register routes

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  const { packageId, packageName, amount, date, userId } = req.body;
  try {
    if (amount < 50) {
      return res.status(400).json({ error: "Package price must be at least ₹50" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: packageName },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        packageId,
        date,
      },
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify payment and create booking
app.post("/api/verify-payment", async (req, res) => {
  const { session_id, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const { packageId, date } = session.metadata;

    // Check if booking already exists
    const existing = await Booking.findOne({ stripeSessionId: session_id });
    if (existing) {
      return res.status(400).json({ success: false, message: "Booking already created" });
    }

    // Create booking with status "Pending"
    const booking = await Booking.create({
      userId: new mongoose.Types.ObjectId(userId),
      packageId: new mongoose.Types.ObjectId(packageId),
      date: date ? new Date(date) : new Date(),
      status: "Pending", // always pending for admin approval
      stripeSessionId: session_id,
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Verify payment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
