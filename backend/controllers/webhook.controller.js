// Webhook controllers receive notifications from payment gateways
// and update the order status in the database.

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

module.exports = { handleStripeWebhook, handleMomoWebhook };
