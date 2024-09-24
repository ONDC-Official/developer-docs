const { validateLogsUtil } = require("./validateLogUtil");

const validateLogs = (domain) => {
  validateLogsUtil(domain);
};

module.exports = { validateLogs };
