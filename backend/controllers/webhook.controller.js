// Webhook controllers receive notifications from payment gateways
// and update the order status in the database.

const CryptoJS = require("crypto-js");
const { markOrderPaid, markOrderFailed } = require("../services/order.service");
const { verifyWebhookSignature } = require("../services/gateways/momo");
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function handleStripeWebhook(req, res, next) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // 1. VERIFY THE SIGNATURE
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. PROCESS THE VERIFIED EVENT
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      await markOrderPaid(orderId);
      console.log(`\n[Stripe Webhook] Payment successful! Order #${orderId} marked as paid.\n`);
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

async function handleZaloPayWebhook(req, res, next) {
  try {
    console.log("\n[ZaloPay Webhook] Nhận được dữ liệu từ ZaloPay:", req.body);
    let result = {};
    const key2 = process.env.ZALOPAY_KEY2;

    // Lấy data và mac do ZaloPay gửi sang
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tính toán lại mac bằng key2 của mình để đối chiếu
    const mac = CryptoJS.HmacSHA256(dataStr, key2).toString();

    // Kiểm tra tính hợp lệ của chữ ký
    if (reqMac !== mac) {
      // Chữ ký không khớp -> Không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Chữ ký hợp lệ -> Xử lý đơn hàng
      const dataJson = JSON.parse(dataStr);
      const app_trans_id = dataJson["app_trans_id"]; // VD: 260508_123456_orderId123

      // Tách orderId từ app_trans_id (lấy phần cuối sau dấu _)
      const parts = app_trans_id.split('_');
      const orderId = parts[parts.length - 1];

      await markOrderPaid(orderId);
      console.log(`\n[ZaloPay Webhook] Giao dịch thành công! Đã cập nhật trạng thái đơn hàng #${orderId}.\n`);

      result.return_code = 1;
      result.return_message = "success";
    }

    // Luôn phải trả về cho ZaloPay biết kết quả
    res.json(result);
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

    const event = req.body;

    // PAYMENT SUCCESS
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = event.resource.custom_id;

      console.log("[PayPal] Payment completed!");
      console.log(`[PayPal] Updated order #${orderId} to PAID\n`);

      await markOrderPaid(orderId);
    }

    // PAYMENT FAILED
    else if (event.event_type === "PAYMENT.CAPTURE.DENIED") {
      const orderId = event.resource.custom_id;

      console.log("[PayPal] Payment failed!");
      console.log(`[PayPal] Updated order #${orderId} to FAILED\n`);

      await markOrderFailed(orderId);
    }

    else {
      console.log(`[PayPal] Event received: ${event.event_type}\n`);
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleStripeWebhook, handleMomoWebhook, handleZaloPayWebhook, handlePaypalWebhook };

