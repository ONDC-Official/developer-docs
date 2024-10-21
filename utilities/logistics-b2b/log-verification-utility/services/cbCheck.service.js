const path = require("path");
const utils = require("../utils/utils");
const vl = require("../utils/validateLogUtil");
const fs = require("fs");

const validateLog = async (domain, dirPath) => {
  try {
    console.log("Inside Log Validation Service...", dirPath);
    const logsPath = path.join(__dirname, "..", dirPath);
    await vl.validateLogs(domain, logsPath);
  } catch (error) {
   console.trace("Error",error) 
  }

};

module.exports = { validateLog };