// ZaloPay gateway stub. TODO: integrate ZaloPay Open API.

async function createSession({ orderId, amount }) {
  return {
    paymentUrl: `https://example-zalopay.test/pay?order=${orderId}&amount=${amount}`,
  };
}

module.exports = { createSession };
