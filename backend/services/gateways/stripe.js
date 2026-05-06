// Stripe gateway stub.
// TODO: replace with real Stripe SDK call:
//   const session = await stripe.checkout.sessions.create({...})

async function createSession({ orderId, amount }) {
  return {
    paymentUrl: `https://example-stripe.test/pay?order=${orderId}&amount=${amount}`,
  };
}

module.exports = { createSession };
