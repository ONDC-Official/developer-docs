const path = require("path");
const utils = require("../utils/utils");
const vl = require("../utils/validateLogUtil");

const fs = require("fs");

const validateLog = async (domain, dirPath) => {
  console.log("Inside Log Validation Service...");
  const logsPath = path.join(__dirname, "..", dirPath);
  switch (domain) {
    case "retail":
      vl.validateLogs(logsPath);
      break;
    default:
      console.log("Invalid Domain!!");
  }
};

// const saveSchema = (domain) => {
//   console.log(
//     `Inside Callback Check Service....\n*** Saving Schemas on DB for ${domain} domain ***`
//   );
//   const logDir = path.join(utils.rootPath, "public", "logs");

//   fs.readdir(logDir, (err, filenames) => {
//     if (err) throw err;
//     filenames.forEach((filename) => {
//       fs.readFile(path.join(logDir, filename), "utf-8", (err, content) => {
//         console.log(`reading file ${filename}`);
//         if (err) throw new Error(err);
//         content = JSON.parse(content);

//         retCbCheckUtil.saveSchema(content, domain);
//       });
//     });
//   });
//   //   console.log(txnId);
// };

module.exports = { validateLog };
