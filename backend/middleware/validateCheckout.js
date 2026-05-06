// Middleware = code that runs before the controller.
// Here we check the request body has all required fields.

function validateCheckout(req, res, next) {
  const { name, phone, movieId, seats, totalPrice, paymentMethod } = req.body || {};
  const errors = [];
  if (!name) errors.push("name is required");
  if (!phone) errors.push("phone is required");
  if (!movieId) errors.push("movieId is required");
  if (!Array.isArray(seats) || seats.length === 0) errors.push("seats must be a non-empty array");
  if (typeof totalPrice !== "number") errors.push("totalPrice must be a number");
  if (!paymentMethod) errors.push("paymentMethod is required");

  if (errors.length) return res.status(400).json({ errors });
  next();
}

module.exports = validateCheckout;
