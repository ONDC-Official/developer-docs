const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const logger = require("../logger");

const checkSupport = (dirPath, msgIdSet) => {
  let sprtObj = {};
  try {
    var support = fs.readFileSync(dirPath + `/${constants.RET_SUPPORT}.json`);
    support = JSON.parse(support);

    try {
      logger.info(`Validating Schema for ${constants.RET_SUPPORT} API`);
      const vs = validateSchema("retail", constants.RET_SUPPORT, support);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(sprtObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_SUPPORT}, ${error.stack}`
      );
    }
    try {
      logger.info(`Checking context for /${constants.RET_SUPPORT} API`); //checking context
      res = checkContext(support.context, constants.RET_SUPPORT);
      if (!res.valid) {
        Object.assign(sprtObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_SUPPORT} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of ${constants.RET_SEARCH} and /${constants.RET_SUPPORT}`
      );
      if (!_.isEqual(dao.getValue("city"), support.context.city)) {
        sprtObj.city = `City code mismatch in ${constants.RET_SEARCH} and /${constants.RET_SUPPORT}`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing city in ${constants.RET_SEARCH} and /${constants.RET_SUPPORT}, ${error.stack}`
      );
    }
    logger.info(
      `Comparing timestamp of /${constants.RET_SUPPORT} and /${constants.RET_ONCONFIRM}`
    );

    try {
      if (_.gte(dao.getValue("tmpstmp"), support.context.timestamp)) {
        dao.setValue("sprtTmpstmp", support.context.timestamp);
        sprtObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_SUPPORT} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_SUPPORT} api, ${error.stack}`
      );
    }
    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_SUPPORT}`
      );
      if (!_.isEqual(dao.getValue("txnId"), support.context.transaction_id)) {
        sprtObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_SUPPORT} api, ${error.stack}`
      );
    }
    try {
      logger.info(`Checking Message Id of /${constants.RET_SUPPORT}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /${constants.RET_SELECT} and /on_select api should be same";
      // }
      if (msgIdSet.has(support.context.message_id)) {
        sprtObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", support.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      logger.error(
        `!!Error while checking message id for /${constants.RET_SUPPORT}, ${error.stack}`
      );
    }
    support = support.message;

    try {
      logger.info(`Checking ref_id in /${constants.RET_SUPPORT}`);
      if (!_.isEqual(dao.getValue("txnId"), support.ref_id)) {
        sprtObj.refId = `Transaction Id should be provided as ref_id`;
      }
    } catch (error) {
      sprtObj.refId = `Transaction Id should be provided as ref_id`;
      logger.error(
        `!!Error while checking ref_id in /${constants.RET_SUPPORT}, ${error.stack}`
      );
    }

    // dao.setValue("sprtObj", sprtObj);
    return sprtObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_SUPPORT} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_SUPPORT} API`,
        err
      );
    }
  }
};

module.exports = checkSupport;
