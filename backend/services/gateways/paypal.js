// PayPal gateway stub. TODO: integrate PayPal Orders API.

async function createSession({ orderId, amount }) {
  return {
    paymentUrl: `https://example-paypal.test/checkout?order=${orderId}&amount=${amount}`,
  };
}

module.exports = { createSession };
