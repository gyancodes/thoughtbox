import express from "express";
import { testConnection } from "../config/database.js";

const router = express.Router();

// Health check endpoint
router.get("/", async (req, res) => {
  try {
    const dbHealthy = await testConnection();

    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? "connected" : "disconnected",
      version: process.env.npm_package_version || "1.0.0",
    };

    res.status(dbHealthy ? 200 : 503).json(health);
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

export default router;
