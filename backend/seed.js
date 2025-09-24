const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.findOneAndUpdate(
    { email: "admin@example.com" },
    { name: "Admin", email: "admin@example.com", password: hashedPassword, role: "admin" },
    { upsert: true }
  );

  console.log("✅ Admin user created");
  process.exit();
}

createAdmin();
