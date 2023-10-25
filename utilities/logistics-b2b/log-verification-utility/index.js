const { validateLog } = require("./services/cbCheck.service");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

try {
  if (process.argv.length < 3) {
    console.log(
      "Need arguments in the format: node index.js 'domain' '/path/to/logs/folder/'"
    );
    return;
  }

  // Setting default values in case arguments not passed
  const domain = process.argv[2].toLowerCase() || "logistics";
  const logpath = process.argv[3] || "./public/logs/";

  //Read Log directory
  fs.readdir(logpath, (err, files) => {
    try {
      if (err) {
        console.log(`Some error occurred while reading files from ${path}`);
      } else if (!files.length) {
        console.log(`${path} folder is empty!!`);
      } else {
        console.log("INDEX", logpath);
        validateLog(domain, logpath);
      }
    } catch (error) {
      console.log(`Error while reading logs folder`, error);
    }
  });
} catch (error) {
  console.log("!!Some Unexpected Error Occurred", error);
}
