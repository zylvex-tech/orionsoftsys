const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findByIdWithPassword(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found", code: "USER_NOT_FOUND" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid token", code: "INVALID_TOKEN" });
  }
};

// Optional auth - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (user) req.user = user;
  } catch (error) { /* Ignore */ }
  next();
};

// Plan-based access control
exports.requirePlan = (minPlan) => {
  const planLevels = { free: 0, starter: 1, professional: 2, enterprise: 3 };
  const minLevel = planLevels[minPlan] || 0;

  return (req, res, next) => {
    const userLevel = planLevels[req.user.plan] || 0;
    if (userLevel < minLevel) {
      return res.status(403).json({
        error: `This feature requires the ${minPlan} plan or higher`,
        code: "PLAN_REQUIRED",
        currentPlan: req.user.plan,
        requiredPlan: minPlan
      });
    }
    next();
  };
};

// Admin middleware
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required", code: "ADMIN_REQUIRED" });
  }
  next();
};
