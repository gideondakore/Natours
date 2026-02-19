const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config({ path: "./.env" });

const logger = require("./utils/logger");

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...", {
    error: err.name,
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

// logger.info("Connecting to the database...");

mongoose
  .connect(DB)
  .then(() => logger.info("DB connection successful!"))
  .catch((err) => {
    logger.error("DB connection error:", { error: err.message });
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`App running on port ${port} in ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! Shutting down...", {
    error: err.name,
    message: err.message,
  });
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated!");
  });
});
