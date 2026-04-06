const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const billingService = require("../services/billingService");
const User = require("../models/User");

// Get user ID from token
async function getUserIdFromToken(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  const jwt = require("jsonwebtoken");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
}

// ==================== INITIALIZE PAYMENT ====================
router.post("/subscribe", async (req, res, next) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const { plan, provider } = req.body;

    if (!["starter", "professional", "enterprise"].includes(plan)) {
      return res.status(400).json({ error: "Invalid plan selected", code: "INVALID_PLAN" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
    }

    let paymentData;

    if (provider === "stripe") {
      paymentData = await billingService.createStripeCheckout(user, plan);
      res.json({ provider: "stripe", url: paymentData.url, sessionId: paymentData.sessionId });
    } else {
      // Default to Paystack
      paymentData = await billingService.createPaystackPayment(user, plan);
      res.json({
        provider: "paystack",
        authorizationUrl: paymentData.authorization_url,
        accessCode: paymentData.access_code,
        reference: paymentData.reference
      });
    }
  } catch (error) {
    next(error);
  }
});

// ==================== VERIFY PAYSTACK PAYMENT ====================
router.post("/verify/paystack", async (req, res, next) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ error: "Payment reference required", code: "NO_REFERENCE" });
    }

    const verification = await billingService.verifyPaystackPayment(reference);

    if (!verification.success) {
      return res.status(400).json({ error: verification.message, code: "PAYMENT_FAILED" });
    }

    const metadata = verification.data.metadata;
    const userId = metadata.custom_fields?.find(f => f.variable_name === "user_id")?.value 
                || metadata.userId;
    const plan = metadata.custom_fields?.find(f => f.variable_name === "plan")?.value 
              || metadata.plan;

    if (!userId || !plan) {
      return res.status(400).json({ error: "Missing payment metadata", code: "MISSING_METADATA" });
    }

    const amount = verification.data.amount; // Already in kobo
    const result = await billingService.activateSubscription(userId, plan, "paystack", reference, amount);

    res.json({
      message: "Subscription activated successfully!",
      plan: result.user.plan,
      subscription: result.subscription
    });
  } catch (error) {
    next(error);
  }
});

// ==================== STRIPE WEBHOOK ====================
router.post("/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;

      await billingService.activateSubscription(
        userId, plan, "stripe", session.id, session.amount_total
      );
      break;
    }
    case "invoice.payment_failed": {
      // Handle failed payment - notify user
      console.log("Payment failed for subscription:", event.data.object.subscription);
      break;
    }
    case "customer.subscription.deleted": {
      // Handle cancelled subscription
      const subscription = event.data.object;
      // Update subscription in DB
      break;
    }
  }

  res.json({ received: true });
});

// ==================== GET SUBSCRIPTION ====================
router.get("/subscription", async (req, res, next) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const subscription = await billingService.getSubscription(userId);
    
    if (!subscription) {
      return res.json({ active: false, message: "No active subscription" });
    }

    res.json({ active: true, ...subscription });
  } catch (error) {
    next(error);
  }
});

// ==================== CANCEL SUBSCRIPTION ====================
router.post("/cancel", async (req, res, next) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required", code: "NO_TOKEN" });
    }

    const result = await billingService.cancelSubscription(userId);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// ==================== PAYSTACK WEBHOOK ====================
router.post("/webhook/paystack", async (req, res) => {
  const event = req.body;

  if (event.event === "charge.success") {
    const data = event.data;
    const metadata = data.metadata;

    if (metadata && metadata.userId && metadata.plan) {
      try {
        await billingService.activateSubscription(
          metadata.userId, metadata.plan, "paystack", data.reference, data.amount
        );
        console.log(`Subscription activated for user ${metadata.userId}`);
      } catch (err) {
        console.error("Error activating subscription:", err);
      }
    }
  }

  res.status(200).send("OK");
});

module.exports = router;
