const winston = require("winston");
const path = require("path");

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
  ),
);

// Format for file output (JSON for easier parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Define transports
const transports = [];

// Console transport (always active)
transports.push(
  new winston.transports.Console({
    format: consoleFormat,
  }),
);

// File transports (only in production or if explicitly enabled)
if (
  process.env.NODE_ENV === "production" ||
  process.env.ENABLE_FILE_LOGGING === "true"
) {
  // Create logs directory if it doesn't exist
  const fs = require("fs");
  const logsDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  // All logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "all.log"),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  );

  // Error logs only
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  );
}

// Create logger instance
const logger = winston.createLogger({
  levels,
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "development" ? "debug" : "info"),
  transports,
  // Don't exit on uncaught exceptions (I handle them separately)
  exitOnError: false,
});

module.exports = logger;
