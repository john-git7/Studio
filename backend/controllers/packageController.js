const Package = require("../models/Package");
const mongoose = require("mongoose");

// Get all packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new package (Admin only)
exports.createPackage = async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.json(newPackage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get package by ID
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update package (Admin only)
exports.updatePackage = async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete package (Admin only)
exports.deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ msg: "Package deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
