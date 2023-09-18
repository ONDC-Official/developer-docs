const fs = require("fs");
const _ = require("lodash");
const dao = require("../dao/dao");
const path = require("path");
const { getObjValues } = require("./utils");
const {sortMerge} = require("./mergeSort");
const Validate = require("./schemaVal");
const clean = require("./clean")

const validateLogs = (domain, dirPath) => {

  let msgIdSet = new Set();
  let ErrorObj = {};

  // Sort & Merge the logs
  const mergefile = path.join(dirPath, '../merged.json')
  ErrorObj["Flow Error"] = sortMerge(domain, dirPath, mergefile);

  //  Log Validation
   Validate(domain, mergefile, msgIdSet, ErrorObj);

  // Cleaning output report
  let log = clean(ErrorObj)

  // Drop DB
  try {
    console.log("Flushing DB Data");
    dao.dropDB();
  } catch (error) {
    console.log("Error while removing LMDB");
  }
try {
  // outputfile = `log${flowId}.json`
  outputfile= 'log_report.json'

  // let out = getObjValues(ErrorObj['Schema'])
let out = JSON.stringify(ErrorObj,null,4)
  fs.writeFileSync(outputfile, out , 'utf-8');
} catch (error) {
  console.log("!!ERROR writing output file",error)
}
 

  console.log("Report Generated Successfully!!");
};
module.exports = { validateLogs };