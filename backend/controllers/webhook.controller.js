const { markOrderPaid, markOrderFailed } = require("../services/order.service");
const { verifyWebhookSignature } = require("../services/gateways/momo");

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
    const { orderId, resultCode } = req.body;

    // Xác minh chữ ký từ MoMo để chắc chắn request hợp lệ
    const isValid = verifyWebhookSignature(req.body);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid MoMo signature" });
    }

    if (resultCode === 0) {
      await markOrderPaid(orderId);
      console.log(`\n[MoMo Webhook] Giao dịch thành công!`);
      console.log(`  orderId    : ${orderId}`);
      console.log(`  resultCode : ${resultCode} (thành công)`);
      console.log(`  transId    : ${req.body.transId}`);
      console.log(`  amount     : ${req.body.amount} VND\n`);
    } else {
      await markOrderFailed(orderId);
      console.log(`\n[MoMo Webhook] Giao dịch THẤT BẠI`);
      console.log(`  orderId    : ${orderId}`);
      console.log(`  resultCode : ${resultCode}`);
      console.log(`  message    : ${req.body.message}\n`);
    }

    // MoMo yêu cầu response 200 để xác nhận đã nhận webhook
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleStripeWebhook, handleMomoWebhook };