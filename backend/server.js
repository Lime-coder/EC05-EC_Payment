// Entry point for the backend server.
// Starts Express, registers middleware and routes.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const checkoutRoutes = require("./routes/checkout.routes");
const webhookRoutes = require("./routes/webhook.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use("/api/webhook", webhookRoutes);
app.use(express.json());

// Routes
app.use("/api/checkout", checkoutRoutes);

app.get("/", (_req, res) => res.send("Movie checkout backend is running"));

// Error handler must be last
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
