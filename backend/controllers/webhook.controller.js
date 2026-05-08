// Webhook controllers receive notifications from payment gateways
// and update the order status in the database.

const CryptoJS = require("crypto-js");
const { markOrderPaid, markOrderFailed } = require("../services/order.service");

async function handleStripeWebhook(req, res, next) {
  try {
    // TODO: verify Stripe signature using STRIPE_WEBHOOK_SECRET
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      await markOrderPaid(event.data.object.metadata.orderId);
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

async function handleMomoWebhook(req, res, next) {
  try {
    // TODO: verify MoMo signature
    const { orderId, resultCode } = req.body;
    if (resultCode === 0) await markOrderPaid(orderId);
    else await markOrderFailed(orderId);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

async function handlePaypalWebhook(req, res, next) {
  try {
    console.log("\n=================================");
    console.log("[PayPal Webhook] Received");
    console.log("Webhook Data:", req.body);
    console.log("=================================\n");

    const eventType = req.body.event_type;

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      console.log("[PayPal] Payment completed!");

      // Lấy orderId nếu có custom_id
      const resource = req.body.resource;

      const orderId =
        resource?.custom_id || "UNKNOWN_ORDER";

      await markOrderPaid(orderId);

      console.log(
        `[PayPal] Updated order #${orderId} to PAID`
      );
    } else {
      console.log(`[PayPal] Event received: ${eventType}`);
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleStripeWebhook, handleMomoWebhook, handlePaypalWebhook };