const { validateLogsUtil } = require("./validateLogUtil");

const validateLogs = async (domain) => {
  await validateLogsUtil(domain);
};

module.exports = { validateLogs };
