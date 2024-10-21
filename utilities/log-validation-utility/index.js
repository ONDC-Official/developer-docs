const { validateLog } = require("./services/cbCheck.service");
const fs = require("fs");
require("dotenv").config();
const logger = require("./utils/logger");
try {
  if (process.argv.length < 3) {
    logger.error(
      "Need arguments in the format: node index.js 'domain' '/path/to/logs/folder/'"
    );
    return;
  }

  const domain = process.argv[2] || "retail";
  const path = process.argv[3] || "./public/logs/";

  fs.readdir(path, function (err, files) {
    try {
      if (err) {
        logger.error(
          `Some error occurred while reading files from ${path}`,
          err
        );
      } else if (!files.length) {
        logger.error(`${path} folder is empty!!`);
      } else {
        validateLog(domain, path);
      }
    } catch (error) {
      logger.error(`Error while reading logs folder`, error);
    }
  });
} catch (error) {
  logger.error(`!!Some Unexpected Error Occurred, ${error.stack}`);
}
