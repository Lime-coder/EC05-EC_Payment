// Webhook endpoints called by payment gateways after a payment succeeds/fails.
// Each gateway has its own URL. Verify signatures inside the controller.

const express = require("express");
const { handleStripeWebhook, handleMomoWebhook, handleZaloPayWebhook } = require("../controllers/webhook.controller");

const router = express.Router();

router.post('/stripe', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);

router.post("/momo", handleMomoWebhook);
router.post("/zalopay", handleZaloPayWebhook);

module.exports = router;
