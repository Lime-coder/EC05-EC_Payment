// MoMo gateway stub. TODO: integrate MoMo Payment API.

async function createSession({ orderId, amount }) {
  return {
    paymentUrl: `https://example-momo.test/pay?order=${orderId}&amount=${amount}`,
  };
}

module.exports = { createSession };
