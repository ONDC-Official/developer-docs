const path = require("path");
const logger = require("../utils/logger");
const vl = require("../utils/validateLogUtil");

const fs = require("fs");

const validateLog = async (domain, dirPath) => {
  logger.info("Inside Log Validation Service...");
  const logsPath = path.join(__dirname, "..", dirPath);
  switch (domain) {
    case "retail":
      vl.validateLogs(logsPath);
      break;
    default:
      logger.warn("Invalid Domain!!");
  }
};

module.exports = { validateLog };
