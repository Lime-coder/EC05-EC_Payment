/**
 * MoMo Payment Gateway
 * Tích hợp MoMo Payment API v2 (Sandbox)
 * Docs: https://developers.momo.vn/v3/docs/payment/api/payment-api/
 */

const https = require("https");
const crypto = require("crypto");

// CẤU HÌNH SANDBOX
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || "MOMOBKUN20180529",
  accessKey: process.env.MOMO_ACCESS_KEY || "klm05TvNBzhg7h7j",
  secretKey: process.env.MOMO_SECRET_KEY || "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa",
  apiEndpoint: process.env.MOMO_API_ENDPOINT || "https://test-payment.momo.vn",
  redirectUrl: process.env.MOMO_REDIRECT_URL || "http://localhost:5173/success",
  ipnUrl: process.env.MOMO_IPN_URL || "http://localhost:4000/api/webhook/momo",
};

/*
 Tạo chữ ký HMAC-SHA256 cho request MoMo
 */
function createSignature(rawSignature) {
  return crypto
    .createHmac("sha256", MOMO_CONFIG.secretKey)
    .update(rawSignature)
    .digest("hex");
}

/*
 Gửi HTTP request đến MoMo API
 */
function sendRequest(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const url = new URL(endpoint);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON response from MoMo"));
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("MoMo request timeout"));
    });

    req.write(body);
    req.end();
  });
}

/**
 * Tạo payment session với MoMo
 * @param {Object} param
 * @param {string} param.orderId      - ID
 * @param {number} param.amount       - Số tiền (VND)
 * @param {string} [param.orderInfo]  - Mô tả
 * @returns {Promise<{paymentUrl, deeplink, qrCodeUrl, requestId}>}
 */
async function createSession({ orderId, amount, orderInfo }) {
  const { partnerCode, accessKey, redirectUrl, ipnUrl } = MOMO_CONFIG;

  const requestId = `${orderId}-${Date.now()}`;
  const orderInfoStr = orderInfo || `Thanh toan ve xem phim - ${orderId}`;
  const extraData = "";
  const requestType = "payWithATM";

  // Raw signature
  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfoStr}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

  const signature = createSignature(rawSignature);

  const payload = {
    partnerCode,
    accessKey,
    requestId,
    amount: String(amount),
    orderId,
    orderInfo: orderInfoStr,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi",
  };

  const response = await sendRequest(
    `${MOMO_CONFIG.apiEndpoint}/v2/gateway/api/create`,
    payload
  );

  // resultCode = 0 là thành công
  if (response.resultCode !== 0) {
    throw new Error(
      `MoMo error ${response.resultCode}: ${response.message || "Unknown error"}`
    );
  }

  return {
    paymentUrl: response.payUrl,
    deeplink: response.deeplink || null,
    qrCodeUrl: response.qrCodeUrl || null,
    requestId,
  };
}

/**
 * Kiểm tra trạng thái thanh toán (query transaction)
 * @param {string} orderId
 */
async function queryTransaction(orderId) {
  const { partnerCode, accessKey } = MOMO_CONFIG;
  const requestId = `QUERY-${orderId}-${Date.now()}`;

  const rawSignature =
    `accessKey=${accessKey}` +
    `&orderId=${orderId}` +
    `&partnerCode=${partnerCode}` +
    `&requestId=${requestId}`;

  const signature = createSignature(rawSignature);

  const payload = { partnerCode, accessKey, requestId, orderId, signature, lang: "vi" };

  return sendRequest(
    `${MOMO_CONFIG.apiEndpoint}/v2/gateway/api/query`,
    payload
  );
}

/*
 Xác minh chữ ký webhook từ MoMo
 Gọi hàm này trong webhook controller để đảm bảo request hợp lệ
 */
function verifyWebhookSignature(body) {
  const {
    amount, extraData, message, orderId, orderInfo,
    orderType, partnerCode, payType, requestId, responseTime,
    resultCode, transId,
  } = body;

  const accessKey = MOMO_CONFIG.accessKey;

  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&message=${message}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&orderType=${orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payType}` +
    `&requestId=${requestId}` +
    `&responseTime=${responseTime}` +
    `&resultCode=${resultCode}` +
    `&transId=${transId}`;

  const expected = createSignature(rawSignature);
  return expected === body.signature;
}

module.exports = { createSession, queryTransaction, verifyWebhookSignature };