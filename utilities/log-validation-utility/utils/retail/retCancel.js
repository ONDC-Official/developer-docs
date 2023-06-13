const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const logger = require("../logger");

const checkCancel = (dirPath, msgIdSet) => {
  let cnclObj = {};
  try {
    var cancel = fs.readFileSync(dirPath + `/${constants.RET_CANCEL}.json`);
    cancel = JSON.parse(cancel);

    try {
      logger.info(`Validating Schema for ${constants.RET_CANCEL} API`);
      const vs = validateSchema("retail", constants.RET_CANCEL, cancel);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(cnclObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_CANCEL}, ${error.stack}`
      );
    }

    logger.info(`Checking context for /${constants.RET_CANCEL} API`); //checking context
    try {
      res = checkContext(cancel.context, constants.RET_CANCEL);
      if (!res.valid) {
        Object.assign(cnclObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_CANCEL} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SELECT} and /${constants.RET_CANCEL}`
      );
      if (!_.isEqual(dao.getValue("city"), cancel.context.city)) {
        cnclObj.city = `City code mismatch in /${constants.RET_SELECT} and /${constants.RET_CANCEL}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SELECT} and /${constants.RET_CANCEL}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_CANCEL} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), cancel.context.timestamp)) {
        dao.setValue("cnclTmpstmp", cancel.context.timestamp);
        cnclObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_CANCEL} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_CANCEL} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_CANCEL}`
      );
      if (!_.isEqual(dao.getValue("txnId"), cancel.context.transaction_id)) {
        cnclObj.txnId = `Transaction Id for should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_CANCEL} api, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking Message Id of /${constants.RET_CANCEL}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /select and /on_select api should be same";
      // }

      if (msgIdSet.has(cancel.context.message_id)) {
        cnclObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", cancel.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      logger.error(
        `!!Error while checking message id for /${constants.RET_CANCEL}, ${error.stack}`
      );
    }

    cancel = cancel.message;

    try {
      logger.info(
        `Comparing order Id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`
      );
      if (cancel.order_id != dao.getValue("cnfrmOrdrId")) {
        cnclObj.cancelOrdrId = `Order Id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM} do not match`;
        logger.info(
          `Order Id mismatch in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`
        );
      }
    } catch (error) {
      logger.info(
        `Error while comparing order id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}, ${error.stack}`
      );
      // cnclObj.cancelOrdrId =
      //   "Order Id in /${constants.RET_CANCEL} and /${constants.RET_ONCONFIRM} do not match";
    }

    try {
      logger.info("Checking the validity of cancellation reason id");
      if (!utils.buyerCancellationRid.has(cancel.cancellation_reason_id)) {
        logger.info(
          `cancellation_reason_id should be a valid cancellation id (buyer app initiated)`
        );

        cnclObj.cancelRid = `Cancellation reason id is not a valid reason id (buyer app initiated)`;
      } else dao.setValue("cnclRid", cancel.cancellation_reason_id);
    } catch (error) {
      // cnclObj.cancelRid =
      //   "Cancellation reason id in /${constants.RET_CANCEL} is not a valid reason id";
      logger.info(
        `Error while checking validity of cancellation reason id /${constants.RET_CANCEL}, ${error.stack}`
      );
    }
    // dao.setValue("cnclObj", cnclObj);
    return cnclObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_CANCEL} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_CANCEL} API`,
        err
      );
    }
  }
};

module.exports = checkCancel;
