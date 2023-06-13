"use strict";
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;
const constants = require("./constants");

const log_dir = constants.LOG_FILE_PATH;

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `[${level}]: ${message}`;
});

const loggerOpts = {
  console: {
    format: combine(colorize(), timestamp(), loggerFormat),
  },
  file: {
    filename: log_dir + "/validations.log",
    level: "info",
    format: combine(timestamp(), loggerFormat),
    options: { flags: "w" },
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  level: "info",
  defaultMeta: { service: "user-service" },
  exitOnError: false,
  transports: [
    new transports.Console(loggerOpts.console),
    new transports.File(loggerOpts.file),
  ],
});

module.exports = logger;
