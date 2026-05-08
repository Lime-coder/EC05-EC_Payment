const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");

async function createSession({ orderId, amount }) {
  const config = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    endpoint: process.env.ZALOPAY_ENDPOINT
  };

  // Thông tin cấu hình thêm gửi kèm
  const embed_data = {
    // redirecturl giúp ZaloPay biết chuyển hướng về đâu sau khi thanh toán xong
    redirecturl: `${process.env.FRONTEND_URL}/success`
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);

  // Dữ liệu đơn hàng gửi lên ZaloPay
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}_${orderId}`, // app_trans_id phải bắt đầu bằng YYMMDD_
    app_user: "user_checkout",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `Thanh toan ve xem phim cho don hang #${orderId}`,
    bank_code: "",
    callback_url: `${process.env.BACKEND_URL}/api/webhook/zalopay`,
  };

  // Tạo chữ ký MAC: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const response = await axios.post(config.endpoint, null, { params: order });

    if (response.data.return_code === 1) {
      return {
        // ZaloPay trả về order_url, ta trả lại cho Frontend redirect
        paymentUrl: response.data.order_url,
      };
    } else {
      console.error("Lỗi từ ZaloPay API:", response.data);
      throw new Error(`ZaloPay trả về lỗi: ${response.data.return_message}`);
    }
  } catch (error) {
    console.error("Lỗi kết nối ZaloPay:", error.message);
    throw error;
  }
}

module.exports = { createSession };
