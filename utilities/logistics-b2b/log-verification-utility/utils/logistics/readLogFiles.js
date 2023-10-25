const fs = require('fs');
const path = require('path');
const { SERVER_LOG_DEST } = require('../constants');

const readLogFiles = async (domain, logPath) => {
  try {
    const files = fs.readdirSync(logPath);
    const firstFileData = fs.readFileSync(
      path.join(
        logPath,
        files.filter((filename) => filename.match(/\.json$/))[0]
      )
    );
    const destination = path.join(
      __dirname,
      "../../",
      SERVER_LOG_DEST,
      domain,
      JSON.parse(firstFileData.toString()).context.transaction_id
    );
    fs.mkdirSync(destination, { recursive: true });
    return destination;
  } catch (err) {
    throw err;
  }
};

module.exports = readLogFiles;
