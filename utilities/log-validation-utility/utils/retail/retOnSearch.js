const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");

const checkOnSearch = (dirPath, msgIdSet) => {
  let onSrchObj = {};

  try {
    let onSearch = fs.readFileSync(dirPath + `/${constants.RET_ONSEARCH}.json`);
    onSearch = JSON.parse(onSearch);
    try {
      console.log(`Validating Schema for ${constants.RET_ONSEARCH} API`);
      const vs = validateSchema("retail", constants.RET_ONSEARCH, onSearch);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(onSrchObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_ONSEARCH}`,
        error
      );
    }

    try {
      console.log(`Storing BAP_ID and BPP_ID in /${constants.RET_ONSEARCH}`);
      dao.setValue("bapId", onSearch.context.bap_id);
      dao.setValue("bppId", onSearch.context.bpp_id);
    } catch (error) {
      console.log(
        `!!Error while storing BAP and BPP Ids in /${constants.RET_ONSEARCH}`,
        error
      );
    }

    try {
      console.log(`Checking context for ${constants.RET_ONSEARCH} API`);
      res = checkContext(onSearch.context, constants.RET_ONSEARCH);
      if (!res.valid) {
        Object.assign(onSrchObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `Some error occurred while checking /${constants.RET_ONSEARCH} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH}`
      );
      if (!_.isEqual(dao.getValue("city"), onSearch.context.city)) {
        onSrchObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH}`
      );
      if (_.gte(dao.getValue("tmpstmp"), onSearch.context.timestamp)) {
        onSrchObj.tmpstmp = `Context timestamp for /${constants.RET_SEARCH} api cannot be greater than or equal to /${constants.RET_ONSEARCH} api`;
      }
      dao.setValue("tmpstmp", onSearch.context.timestamp);
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api`
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH}`
      );
      if (!_.isEqual(dao.getValue("txnId"), onSearch.context.transaction_id)) {
        onSrchObj.txnId = `Transaction Id for /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api should be same`;
      }
      // dao.setValue("txnId", onSearch.context.transaction_id);
    } catch (error) {
      console.log(
        `Error while comparing transaction ids for /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing Message Ids of /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH}`
      );
      if (!_.isEqual(dao.getValue("msgId"), onSearch.context.message_id)) {
        onSrchObj.msgId = `Message Id for /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api should be same`;
      }
      msgIdSet.add(onSearch.context.message_id);
    } catch (error) {
      console.log(
        `Error while comparing message ids for /${constants.RET_SEARCH} and /${constants.RET_ONSEARCH} api`,
        error
      );
    }

    onSearch = onSearch.message.catalog;
    // console.log(onSearch["bpp/providers"]);
    dao.setValue("onSearch", onSearch);

    // try {
    //   console.log("Checking available and max count in on_search catalog");
    // } catch (error) {}
    dao.setValue("onSrchObj", onSrchObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for ${constants.RET_ONSEARCH} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONSEARCH} API`
      );
    }
  }
};

module.exports = checkOnSearch;
