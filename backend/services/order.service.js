// Services contain business logic and talk to the database.
// Replace the in-memory Map with a real DB (Postgres, MongoDB, etc.).

const orders = new Map();

async function createOrder(data) {
  const id = `ORD-${Date.now()}`;
  const order = { id, status: "pending", createdAt: new Date(), ...data };
  orders.set(id, order);
  return order;
}

async function markOrderPaid(orderId) {
  const order = orders.get(orderId);
  if (order) order.status = "paid";
  return order;
}

async function markOrderFailed(orderId) {
  const order = orders.get(orderId);
  if (order) order.status = "failed";
  return order;
}

async function getOrder(orderId) {
  return orders.get(orderId);
}

module.exports = { createOrder, markOrderPaid, markOrderFailed, getOrder };
