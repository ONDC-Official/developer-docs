const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const logger = require("../logger");

const checkStatus = (dirPath, msgIdSet) => {
  let statObj = {};
  try {
    let status = fs.readFileSync(dirPath + `/${constants.RET_STATUS}.json`);
    status = JSON.parse(status);

    try {
      logger.info(`Validating Schema for ${constants.RET_STATUS} API`);
      const vs = validateSchema("retail", constants.RET_STATUS, status);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(statObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_STATUS}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking context for /${constants.RET_STATUS} API`); //checking context
      res = checkContext(status.context, constants.RET_STATUS);
      if (!res.valid) {
        Object.assign(statObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_STATUS} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_STATUS}`
      );
      if (!_.isEqual(dao.getValue("city"), status.context.city)) {
        statObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_STATUS}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_STATUS}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_STATUS} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), status.context.timestamp)) {
        dao.setValue("statTmpstmp", status.context.timestamp);
        statObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_STATUS} api`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_STATUS} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_STATUS}`
      );
      if (!_.isEqual(dao.getValue("txnId"), status.context.transaction_id)) {
        statObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_STATUS} api`
      );
    }

    try {
      logger.info(`Checking Message Id of /${constants.RET_STATUS}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for ${constants.RET_SELECT} and /on_select api should be same";
      // }

      if (msgIdSet.has(status.context.message_id)) {
        statObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", status.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      logger.error(
        `!!Error while checking message id for /${constants.RET_STATUS}`
      );
    }

    status = status.message;

    try {
      logger.info(
        `Comparing order id for /${constants.RET_CONFIRM} and /${constants.RET_STATUS}`
      );
      if (dao.getValue("cnfrmOrdrId") != status.order_id) {
        statObj.orderId = `Order ids in /${constants.RET_CONFIRM} and /${constants.RET_STATUS} do not match`;
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing order ids /confirm and /${constants.RET_STATUS}, ${error.stack}`
      );
    }

    // dao.setValue("statObj", statObj);
    return statObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_STATUS} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_STATUS} API`,
        err
      );
    }
  }
};

module.exports = checkStatus;
