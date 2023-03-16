const fs = require("fs");
const _ = require("lodash");
const dao = require("../dao/dao");
// const path = require("path");
const { getObjValues } = require("./utils");
const checkSearch = require("./retail/retSearch");
const checkOnSearch = require("./retail/retOnSearch");
const checkSelect = require("./retail/retSelect");
const checkOnSelect = require("./retail/retOnSelect");
const checkInit = require("./retail/retInit");
const checkOnInit = require("./retail/retOnInit");
const checkConfirm = require("./retail/retConfirm");
const checkOnConfirm = require("./retail/retOnConfirm");
const checkStatus = require("./retail/retStatus");
const checkOnStatus = require("./retail/retOnStatus");
const checkTrack = require("./retail/retTrack");
const checkOnTrack = require("./retail/retOnTrack");
const checkCancel = require("./retail/retCancel");
const checkOnCancel = require("./retail/retOnCancel");
const checkSupport = require("./retail/retSupport");
const checkOnSupport = require("./retail/retOnSupport");
const checkUpdate = require("./retail/retUpdate");
const checkOnUpdate = require("./retail/retOnUpdate");

//TAT in on_select = sumof(time to ship in /on_search and TAT by LSP in logistics /on_search)
// If non-serviceable in /on_select, there should be domain-error

const validateLogs = (dirPath) => {
  // const dirPath = path.join(__dirname, "test_logs");

  let msgIdSet = new Set();

  //SEARCH API

  let srchResp = checkSearch(dirPath, msgIdSet);

  // ON_SEARCH API

  let onSrchResp = checkOnSearch(dirPath, msgIdSet);

  //SELECT API

  let slctResp = checkSelect(dirPath, msgIdSet);

  // //ON_SELECT API

  let onSlctResp = checkOnSelect(dirPath, msgIdSet);

  // //INIT API

  let initResp = checkInit(dirPath, msgIdSet);

  // //ON_INIT API

  let onInitResp = checkOnInit(dirPath, msgIdSet);

  // //CONFIRM API

  let cnfrmResp = checkConfirm(dirPath, msgIdSet);

  // //ON_CONFIRM API

  let onCnfrmResp = checkOnConfirm(dirPath, msgIdSet);

  // //STATUS API
  let statResp = checkStatus(dirPath, msgIdSet);

  // //ON_STATUS API

  let onStatResp = checkOnStatus(dirPath, msgIdSet);

  // //UPDATE API

  let updtResp = checkUpdate(dirPath, msgIdSet);

  // //ON_UPDATE API

  let onUpdtResp = checkOnUpdate(dirPath, msgIdSet);

  // //TRACK API

  let trckResp = checkTrack(dirPath, msgIdSet);

  // //ON_TRACK API

  let onTrckResp = checkOnTrack(dirPath, msgIdSet);

  // //CANCEL API

  let cnclResp = checkCancel(dirPath, msgIdSet);

  // //ON_CANCEL API

  let onCnclResp = checkOnCancel(dirPath, msgIdSet);

  // //SUPPORT API
  let sprtResp = checkSupport(dirPath, msgIdSet);

  // //ON_SUPPORT API
  let onSprtResp = checkOnSupport(dirPath, msgIdSet);

  let logReport = "";

  let srchObj = dao.getValue("srchObj");
  let onSrchObj = dao.getValue("onSrchObj");
  let slctObj = dao.getValue("slctObj");
  let onSlctObj = dao.getValue("onSlctObj");
  let initObj = dao.getValue("initObj");
  let onInitObj = dao.getValue("onInitObj");
  let cnfrmObj = dao.getValue("cnfrmObj");
  let onCnfrmObj = dao.getValue("onCnfrmObj");
  let cnclObj = dao.getValue("cnclObj");
  let onCnclObj = dao.getValue("onCnclObj");
  let trckObj = dao.getValue("trckObj");
  let onTrckObj = dao.getValue("onTrckObj");
  let sprtObj = dao.getValue("sprtObj");
  let onSprtObj = dao.getValue("onSprtObj");
  let updtObj = dao.getValue("updtObj");
  let onUpdtObj = dao.getValue("onUpdtObj");
  let statObj = dao.getValue("statObj");
  let onStatObj = dao.getValue("onStatObj");

  try {
    console.log("Flushing DB Data");
    dao.dropDB();
  } catch (error) {
    console.log("Error while removing LMDB");
  }

  if (!_.isEmpty(srchObj)) {
    logReport += `**/search**\n${getObjValues(srchObj)}\n`;
  }

  if (!_.isEmpty(onSrchObj)) {
    logReport += `**/on_search**\n${getObjValues(onSrchObj)}\n`;
  }

  if (!_.isEmpty(slctObj)) {
    logReport += `**/select**\n${getObjValues(slctObj)}\n`;
  }

  if (!_.isEmpty(onSlctObj)) {
    logReport += `**/on_select**\n${getObjValues(onSlctObj)}\n`;
  }

  if (!_.isEmpty(initObj)) {
    logReport += `**/init**\n${getObjValues(initObj)}\n`;
  }

  if (!_.isEmpty(onInitObj)) {
    logReport += `**/on_init**\n${getObjValues(onInitObj)}\n`;
  }

  if (!_.isEmpty(cnfrmObj)) {
    logReport += `**/confirm**\n${getObjValues(cnfrmObj)}\n`;
  }

  if (!_.isEmpty(onCnfrmObj)) {
    logReport += `**/on_confirm**\n${getObjValues(onCnfrmObj)}\n`;
  }

  if (!_.isEmpty(cnclObj)) {
    logReport += `**/cancel**\n${getObjValues(cnclObj)}\n`;
  }

  if (!_.isEmpty(onCnclObj)) {
    logReport += `**/on_cancel**\n${getObjValues(onCnclObj)}\n`;
  }

  if (!_.isEmpty(trckObj)) {
    logReport += `**/track**\n${getObjValues(trckObj)}\n`;
  }

  if (!_.isEmpty(onTrckObj)) {
    logReport += `**/on_track**\n${getObjValues(onTrckObj)}\n`;
  }

  if (!_.isEmpty(statObj)) {
    logReport += `**/status**\n${getObjValues(statObj)}\n`;
  }
  if (!_.isEmpty(onStatObj)) {
    logReport += `**/on_status**\n${getObjValues(onStatObj)}\n`;
  }

  if (!_.isEmpty(updtObj)) {
    logReport += `**/update**\n${getObjValues(updtObj)}\n`;
  }
  if (!_.isEmpty(onUpdtObj)) {
    logReport += `**/on_update**\n${getObjValues(onUpdtObj)}\n`;
  }

  if (!_.isEmpty(sprtObj)) {
    logReport += `**/support**\n${getObjValues(sprtObj)}\n`;
  }

  if (!_.isEmpty(onSprtObj)) {
    logReport += `**/on_support** \n${getObjValues(onSprtObj)}\n`;
  }

  fs.writeFileSync("log_report.md", logReport);

  console.log("Report Generated Successfully!!");
};

module.exports = { validateLogs };
