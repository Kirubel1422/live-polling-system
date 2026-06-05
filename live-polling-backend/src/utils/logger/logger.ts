import winston from "winston";
import { ENV } from "src/constants/dotenv";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  // Enable 'http' logging level in production so requests are logged
  return ENV.NODE_ENV === "dev" ? "debug" : "http";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

// Clean text format for log files
const uncoloredFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

// Colored format for terminal
const coloredFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({
    format: coloredFormat,
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: uncoloredFormat,
  }),
  new winston.transports.File({ 
    filename: "logs/app.log",
    format: uncoloredFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
