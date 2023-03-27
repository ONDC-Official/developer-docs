const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnSupport = (dirPath, msgIdSet) => {
  let onSprtObj = {};

  try {
    let on_support = fs.readFileSync(
      dirPath + `/${constants.RET_ONSUPPORT}.json`
    );
    on_support = JSON.parse(on_support);

    try {
      console.log(`Validating Schema for /${constants.RET_ONSUPPORT} API`);
      const vs = validateSchema("retail", constants.RET_ONSUPPORT, on_support);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(onSprtObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_ONSUPPORT}`,
        error
      );
    }

    try {
      console.log(`Checking context for /${constants.RET_ONSUPPORT} API`); //checking context
      res = checkContext(on_support.context, constants.RET_ONSUPPORT);
      if (!res.valid) {
        Object.assign(onSprtObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONSUPPORT} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONSUPPORT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_support.context.city)) {
        onSprtObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONSUPPORT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONSUPPORT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_SUPPORT} and /${constants.RET_ONSUPPORT}`
      );
      if (_.gte(dao.getValue("sprtTmpstmp"), on_support.context.timestamp)) {
        onSprtObj.tmpstmp = `Timestamp for /${constants.RET_SUPPORT} api cannot be greater than or equal to /${constants.RET_ONSUPPORT} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.RET_SUPPORT} and /${constants.RET_ONSUPPORT} api`
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONSUPPORT}`
      );
      if (
        !_.isEqual(dao.getValue("txnId"), on_support.context.transaction_id)
      ) {
        onSprtObj.txnId = `transaction_id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONSUPPORT} api`,
        error
      );
    }

    try {
      console.log("Checking Message Id of /on_support");
      if (!_.isEqual(dao.getValue("msgId"), on_support.context.message_id)) {
        onSprtObj.msgId = `Message Id for /${constants.RET_SUPPORT} and /${constants.RET_ONSUPPORT} api should be same`;
      }

      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_support.context.message_id);
    } catch (error) {
      console.log(
        `Error while checking message id for /${constants.RET_ONSUPPORT}`,
        error
      );
    }

    on_support = on_support.message;

    dao.setValue("onSprtObj", onSprtObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_ONSUPPORT} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONSUPPORT} API`,
        err
      );
    }
  }
};

module.exports = checkOnSupport;
