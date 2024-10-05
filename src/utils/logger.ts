import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;
import DailyRotateFile from "winston-daily-rotate-file";

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new DailyRotateFile({
      filename: 'app.log', // Directory for log files, logs folder should exist
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1d', // Keep logs for 14 days
      format: json(),
    }),
  ],
});

export default logger;