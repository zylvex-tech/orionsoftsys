const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  plan: {
    type: String,
    enum: ["starter", "professional", "enterprise"],
    required: true
  },
  provider: {
    type: String,
    enum: ["paystack", "stripe", "manual"],
    required: true
  },
  providerReference: { type: String, required: true }, // Paystack authorization code or Stripe subscription ID
  amount: { type: Number, required: true }, // Amount in smallest currency unit (kobo/cents)
  currency: { type: String, default: "NGN" },
  status: {
    type: String,
    enum: ["active", "past_due", "cancelled", "expired"],
    default: "active"
  },
  currentPeriodStart: { type: Date, required: true },
  currentPeriodEnd: { type: Date, required: true },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  canceledAt: { type: Date },
  lastPaymentDate: { type: Date },
  nextBillingDate: { type: Date },
  paymentHistory: [{
    amount: Number,
    date: { type: Date, default: Date.now },
    reference: String,
    status: { type: String, default: "success" }
  }]
}, {
  timestamps: true
});

// Get active subscription for user
subscriptionSchema.statics.getActiveByUser = function(userId) {
  return this.findOne({
    userId,
    status: "active",
    currentPeriodEnd: { $gte: new Date() }
  }).sort({ createdAt: -1 });
};

// Get all subscriptions for user
subscriptionSchema.statics.getAllByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

module.exports = mongoose.model("Subscription", subscriptionSchema);
