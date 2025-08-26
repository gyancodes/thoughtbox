import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { requireAuth, clerkMiddleware } from "@clerk/express";

// Load environment variables
dotenv.config();

// Import routes
import notesRouter from "./routes/notes.js";
import healthRouter from "./routes/health.js";

// Import database functions
import { testConnection, initializeDatabase } from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Clerk middleware (temporarily disabled for development)
// app.use(clerkMiddleware());

// Health check route (no auth required)
app.use("/api/health", healthRouter);

// Protected routes (temporarily without auth for development)
app.use("/api/notes", notesRouter);

// Error handling middleware
app.use((err, req, res) => {
  console.error("Error:", err);

  if (err.status === 401) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required",
    });
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  
  // Test database connection and initialize tables
  const dbConnected = await testConnection();
  if (dbConnected) {
    await initializeDatabase();
  }
});

export default app;
