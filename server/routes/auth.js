const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { authLimiter } = require("../middleware/rateLimiter");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ==================== REGISTER ====================
router.post("/register", authLimiter, [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg, code: "VALIDATION_ERROR" });
    }

    const { name, email, password, businessType, phone } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered", code: "EMAIL_EXISTS" });
    }

    // Create user with 14-day trial
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const user = await User.create({
      name,
      email,
      password,
      businessType: businessType || "other",
      phone: phone || "",
      plan: "free",
      subscriptionStatus: "trial",
      trialEndsAt
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully. Your 14-day free trial has started.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        trialEndsAt: user.trialEndsAt
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// ==================== LOGIN ====================
router.post("/login", authLimiter, [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg, code: "VALIDATION_ERROR" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "No account found with this email", code: "USER_NOT_FOUND" });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password", code: "INVALID_PASSWORD" });
    }

    // Update last active
    user.lastActiveAt = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Welcome back!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt,
        businessType: user.businessType
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// ==================== GET PROFILE ====================
router.get("/profile", async (req, res, next) => {
  try {
    // Extract token from header (auth handled in route)
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Not authenticated", code: "NO_TOKEN" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
    }

    // Check if trial expired
    if (user.subscriptionStatus === "trial" && user.trialEndsAt && new Date() > user.trialEndsAt) {
      user.subscriptionStatus = "expired";
      await user.save();
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt,
        businessType: user.businessType,
        phone: user.phone,
        aiContext: user.aiContext,
        messagesThisPeriod: user.messagesThisPeriod,
        totalMessagesAllTime: user.totalMessagesAllTime,
        limits: user.getPlanLimits()
      }
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    next(error);
  }
});

// ==================== UPDATE PROFILE ====================
router.put("/profile", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Not authenticated", code: "NO_TOKEN" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
    }

    // Update allowed fields
    const allowedFields = ["name", "phone", "businessType", "aiContext"];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Optional: update password
    if (req.body.password && req.body.password.length >= 6) {
      user.password = req.body.password; // Hash happens in pre-save hook
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        businessType: user.businessType,
        phone: user.phone,
        aiContext: user.aiContext
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
