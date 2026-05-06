// Routes = URL definitions.
// They map an HTTP path to a controller function.

const express = require("express");
const { createCheckout } = require("../controllers/checkout.controller");
const validateCheckout = require("../middleware/validateCheckout");

const router = express.Router();

// POST /api/checkout
router.post("/", validateCheckout, createCheckout);

module.exports = router;
