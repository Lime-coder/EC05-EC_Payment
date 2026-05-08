// Stripe gateway stub.
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createSession({ orderId, amount }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    line_items: [
      {
        price_data: {
          currency: 'vnd',

          product_data: {
            name: `Order #${orderId}`,
          },

          unit_amount: amount,
        },

        quantity: 1,
      },
    ],

    mode: 'payment',

    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel',

    metadata: {
      orderId,
    },
  });

  return {
    paymentUrl: session.url,
  };
}

module.exports = { createSession };