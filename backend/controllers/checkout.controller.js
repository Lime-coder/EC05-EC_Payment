// Controllers handle the HTTP request/response.
// They call services to do the actual work, then send a response.

const { createOrder } = require("../services/order.service");
const { createPaymentSession } = require("../services/payment.service");

async function createCheckout(req, res, next) {
  try {
    const { name, phone, movieId, seats, totalPrice, paymentMethod } = req.body;

    // 1. Save the order in the database (pending state)
    const order = await createOrder({ name, phone, movieId, seats, totalPrice, paymentMethod });

    // 2. Ask the chosen gateway for a payment URL
    const { paymentUrl } = await createPaymentSession({
      orderId: order.id,
      amount: totalPrice,
      method: paymentMethod,
    });

    // 3. Send the URL back to the frontend, which will redirect the user
    res.json({ orderId: order.id, paymentUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCheckout };
