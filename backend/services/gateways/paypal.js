const paypal = require("@paypal/checkout-server-sdk");

function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

async function createSession({ orderId, amount }) {
  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderId,
        amount: {
          currency_code: "USD",
          value: (amount / 25000).toFixed(2),
        },
      },
    ],
    application_context: {
      return_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    },
  });

  const response = await client().execute(request);

  const approveLink = response.result.links.find(
    (link) => link.rel === "approve"
  );

  return {
    paymentUrl: approveLink.href,
  };
}

module.exports = { createSession };