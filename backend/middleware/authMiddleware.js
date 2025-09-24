const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });
  next();
}

module.exports = { authMiddleware, adminMiddleware };
