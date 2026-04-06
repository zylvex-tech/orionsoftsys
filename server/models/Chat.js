const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  session: { type: String, default: "default" },
  messages: [chatMessageSchema],
  leadCaptured: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  totalExchanges: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for fast lookups
chatSchema.index({ userId: 1, createdAt: -1 });

// Get recent conversations
chatSchema.statics.getRecentByUser = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ lastActiveAt: -1 })
    .limit(limit)
    .lean();
};

module.exports = mongoose.model("Chat", chatSchema);
