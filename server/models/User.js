const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  businessType: {
    type: String,
    enum: ["small-business", "education", "healthcare", "real-estate", "ecommerce", "startup", "enterprise", "other"],
    default: "other"
  },
  phone: { type: String, default: "" },
  plan: {
    type: String,
    enum: ["free", "starter", "professional", "enterprise"],
    default: "free"
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "trial", "expired", "cancelled"],
    default: "trial"
  },
  trialEndsAt: { type: Date },
  planResetsAt: { type: Date },
  messageCount: { type: Number, default: 0 },
  messagesThisPeriod: { type: Number, default: 0 },
  totalMessagesAllTime: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now },
  aiContext: { type: String, default: "" }, // Custom business context for AI
  metadata: { type: Map, of: String, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get plan limits
userSchema.getPlanLimits = function() {
  const limits = {
    free:          { messagesPerDay: 10,  features: ["basic-chat"] },
    starter:       { messagesPerDay: 500, features: ["basic-chat", "lead-capture", "email-support"] },
    professional:  { messagesPerDay: -1,  features: ["basic-chat", "lead-capture", "email-support", "whatsapp", "crm-integration", "analytics", "priority-support"] },
    enterprise:    { messagesPerDay: -1,  features: ["all"] }
  };
  return limits[this.plan] || limits.free;
};

// Check if user can send more messages today
userSchema.canSendMessage = function() {
  const limits = this.getPlanLimits();
  if (limits.messagesPerDay === -1) return true; // Unlimited
  return this.messagesThisPeriod < limits.messagesPerDay;
};

// Reset daily counter
userSchema.resetDailyCounter = async function() {
  const now = new Date();
  const lastReset = this.planResetsAt ? new Date(this.planResetsAt) : new Date(0);
  
  if (now.toDateString() !== lastReset.toDateString()) {
    this.messagesThisPeriod = 0;
    this.planResetsAt = now;
    await this.save();
  }
};

module.exports = mongoose.model("User", userSchema);
