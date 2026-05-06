// Payment service: picks the right gateway based on the chosen method.
// Each gateway lives in its own file for clarity.

const stripe = require("./gateways/stripe");
const paypal = require("./gateways/paypal");
const momo = require("./gateways/momo");
const zalopay = require("./gateways/zalopay");

const gateways = { stripe, paypal, momo, zalopay };

async function createPaymentSession({ orderId, amount, method }) {
  const gateway = gateways[method];
  if (!gateway) throw new Error(`Unsupported payment method: ${method}`);
  return gateway.createSession({ orderId, amount });
}

module.exports = { createPaymentSession };
