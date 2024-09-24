const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");
const logger = require("../logger");

const checkOnSupport = (dirPath, msgIdSet) => {
  let onSprtObj = {};

  try {
    let on_support = fs.readFileSync(
      dirPath + `/${constants.RET_ONSUPPORT}.json`
    );
    on_support = JSON.parse(on_support);

    try {
      logger.info(`Validating Schema for /${constants.RET_ONSUPPORT} API`);
      const vs = validateSchema("retail", constants.RET_ONSUPPORT, on_support);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(onSprtObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONSUPPORT}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking context for /${constants.RET_ONSUPPORT} API`); //checking context
      res = checkContext(on_support.context, constants.RET_ONSUPPORT);
      if (!res.valid) {
        Object.assign(onSprtObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONSUPPORT} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONSUPPORT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_support.context.city)) {
        onSprtObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONSUPPORT}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONSUPPORT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_SUPPORT} and /${constants.RET_ONSUPPORT}`
      );
      if (_.gte(dao.getValue("sprtTmpstmp"), on_support.context.timestamp)) {
        onSprtObj.tmpstmp = `Timestamp for /${constants.RET_SUPPORT} api cannot be greater than or equal to /${constants.RET_ONSUPPORT} api`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing timestamp for /${constants.RET_SUPPORT} and /${constants.RET_ONSUPPORT} api`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONSUPPORT}`
      );
      if (
        !_.isEqual(dao.getValue("txnId"), on_support.context.transaction_id)
      ) {
        onSprtObj.txnId = `transaction_id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONSUPPORT} api, ${error.stack}`
      );
    }

    try {
      logger.info("Checking Message Id of /on_support");
      if (!_.isEqual(dao.getValue("msgId"), on_support.context.message_id)) {
        onSprtObj.msgId = `Message Id for /${constants.RET_SUPPORT} and /${constants.RET_ONSUPPORT} api should be same`;
      }

      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_support.context.message_id);
    } catch (error) {
      logger.info(
        `Error while checking message id for /${constants.RET_ONSUPPORT}, ${error.stack}`
      );
    }

    on_support = on_support.message;

    // dao.setValue("onSprtObj", onSprtObj);
    return onSprtObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_ONSUPPORT} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONSUPPORT} API`,
        err
      );
    }
  }
};

module.exports = checkOnSupport;
