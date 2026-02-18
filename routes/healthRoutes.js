const express = require("express");

const router = express.Router();

// Health check endpoint - accessible without authentication
router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
  });
});

module.exports = router;
