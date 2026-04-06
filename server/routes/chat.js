const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { chatLimiter } = require("../middleware/rateLimiter");
const { processChat, getChatHistory } = require("../services/aiService");

// ==================== SEND MESSAGE ====================
router.post("/", chatLimiter, async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const jwt = require("jsonwebtoken");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token", code: "INVALID_TOKEN" });
    }

    const User = require("../models/User");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
    }

    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required", code: "EMPTY_MESSAGE" });
    }

    const result = await processChat(user, message.trim());

    res.json({
      reply: result.reply,
      leadCaptured: result.leadCaptured,
      usage: result.usage
    });
  } catch (error) {
    next(error);
  }
});

// ==================== GET CHAT HISTORY ====================
router.get("/history", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const limit = parseInt(req.query.limit) || 10;
    const history = await getChatHistory(decoded.id, limit);

    res.json({ conversations: history });
  } catch (error) {
    next(error);
  }
});

// ==================== CLEAR CHAT HISTORY ====================
router.delete("/history", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Chat = require("../models/Chat");
    await Chat.deleteMany({ userId: decoded.id });

    res.json({ message: "Chat history cleared" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
