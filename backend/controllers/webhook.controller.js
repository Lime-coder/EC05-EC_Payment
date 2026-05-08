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


module.exports = { handleStripeWebhook, handleMomoWebhook, handleZaloPayWebhook };

