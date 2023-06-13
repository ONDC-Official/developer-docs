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
// const checkOnStatus = require("./retail/retOnStatus");
const checkTrack = require("./retail/retTrack");
const checkOnTrack = require("./retail/retOnTrack");
const checkCancel = require("./retail/retCancel");
const checkOnCancel = require("./retail/retOnCancel");
const checkSupport = require("./retail/retSupport");
const checkOnSupport = require("./retail/retOnSupport");
const checkUpdate = require("./retail/retUpdate");
const checkUnsolicitedStatus = require("./retail/retUnsolicitedOnStatus");
const logger = require("./logger");
const checkUnsolicitedOnUpdate = require("./retail/retUnsolicitedOnUpdate");
const checkUpdateBilling = require("./retail/retUpdateBilling");
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

  // let onStatResp = checkOnStatus(dirPath, msgIdSet);
  let onStatResp = checkUnsolicitedStatus(dirPath, msgIdSet);

  // //UPDATE API

  let updtResp = checkUpdate(dirPath, msgIdSet);

  // //ON_UPDATE API

  let onUpdtResp = checkUnsolicitedOnUpdate(dirPath, msgIdSet);

  // //UPDATE REFUND API
  let updtRfndResp = checkUpdateBilling(dirPath, msgIdSet);

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

  try {
    logger.info("Flushing DB Data");
    dao.dropDB();
  } catch (error) {
    logger.error("!!Error while removing LMDB", error);
  }

  if (!_.isEmpty(srchResp)) {
    logReport += `**/search**\n${getObjValues(srchResp)}\n`;
  }

  if (!_.isEmpty(onSrchResp)) {
    logReport += `**/on_search**\n${getObjValues(onSrchResp)}\n`;
  }

  if (!_.isEmpty(slctResp)) {
    logReport += `**/select**\n${getObjValues(slctResp)}\n`;
  }

  if (!_.isEmpty(onSlctResp)) {
    logReport += `**/on_select**\n${getObjValues(onSlctResp)}\n`;
  }

  if (!_.isEmpty(initResp)) {
    logReport += `**/init**\n${getObjValues(initResp)}\n`;
  }

  if (!_.isEmpty(onInitResp)) {
    logReport += `**/on_init**\n${getObjValues(onInitResp)}\n`;
  }

  if (!_.isEmpty(cnfrmResp)) {
    logReport += `**/confirm**\n${getObjValues(cnfrmResp)}\n`;
  }

  if (!_.isEmpty(onCnfrmResp)) {
    logReport += `**/on_confirm**\n${getObjValues(onCnfrmResp)}\n`;
  }

  if (!_.isEmpty(cnclResp)) {
    logReport += `**/cancel**\n${getObjValues(cnclResp)}\n`;
  }

  if (!_.isEmpty(onCnclResp)) {
    logReport += `**/on_cancel**\n${getObjValues(onCnclResp)}\n`;
  }

  if (!_.isEmpty(trckResp)) {
    logReport += `**/track**\n${getObjValues(trckResp)}\n`;
  }

  if (!_.isEmpty(onTrckResp)) {
    logReport += `**/on_track**\n${getObjValues(onTrckResp)}\n`;
  }

  if (!_.isEmpty(statResp)) {
    logReport += `**/status**\n${getObjValues(statResp)}\n`;
  }
  if (!_.isEmpty(onStatResp.pending)) {
    logReport += `**/on_status (Pending)**\n${getObjValues(
      onStatResp.pending
    )}\n`;
  }
  if (!_.isEmpty(onStatResp.picked)) {
    logReport += `**/on_status (Order-picked-up)**\n${getObjValues(
      onStatResp.picked
    )}\n`;
  }
  if (!_.isEmpty(onStatResp.delivered)) {
    logReport += `**/on_status (Order-Delivered)**\n${getObjValues(
      onStatResp.delivered
    )}\n`;
  }

  if (!_.isEmpty(updtResp)) {
    logReport += `**/update**\n${getObjValues(updtResp)}\n`;
  }
  if (!_.isEmpty(onUpdtResp.initiated)) {
    logReport += `**/on_update (Initiated)**\n${getObjValues(
      onUpdtResp.initiated
    )}\n`;
  }
  if (!_.isEmpty(onUpdtResp.liquidated)) {
    logReport += `**/on_update (Liquidated)**\n${getObjValues(
      onUpdtResp.liquidated
    )}\n`;
  }
  if (!_.isEmpty(onUpdtResp.rejected)) {
    logReport += `**/on_update (Rejected)**\n${getObjValues(
      onUpdtResp.rejected
    )}\n`;
  }
  if (!_.isEmpty(onUpdtResp.return_approved)) {
    logReport += `**/on_update (Return_Approved)**\n${getObjValues(
      onUpdtResp.return_approved
    )}\n`;
  }
  if (!_.isEmpty(onUpdtResp.return_delivered)) {
    logReport += `**/on_update (Return_Delivered)**\n${getObjValues(
      onUpdtResp.return_delivered
    )}\n`;
  }

  if (!_.isEmpty(updtRfndResp)) {
    logReport += `**/update (Refund)**\n${getObjValues(updtRfndResp)}\n`;
  }

  if (!_.isEmpty(sprtResp)) {
    logReport += `**/support**\n${getObjValues(sprtResp)}\n`;
  }

  if (!_.isEmpty(onSprtResp)) {
    logReport += `**/on_support** \n${getObjValues(onSprtResp)}\n`;
  }

  fs.writeFileSync("log_report.md", logReport);

  logger.info("Report Generated Successfully!!");
};

module.exports = { validateLogs };
