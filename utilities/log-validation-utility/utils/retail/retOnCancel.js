const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const logger = require("../logger");

const checkOnCancel = (dirPath, msgIdSet) => {
  let onCnclObj = {};

  try {
    let on_cancel = fs.readFileSync(
      dirPath + `/${constants.RET_ONCANCEL}.json`
    );
    const isSolicited = fs.existsSync(
      dirPath + `/${constants.RET_CANCEL}.json`
    );

    on_cancel = JSON.parse(on_cancel);

    try {
      logger.info(`Validating Schema for /${constants.RET_ONCANCEL} API`);
      const vs = validateSchema("retail", constants.RET_ONCANCEL, on_cancel);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(onCnclObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONCANCEL}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking context for /${constants.RET_ONCANCEL} API`); //checking context
      res = checkContext(on_cancel.context, constants.RET_ONCANCEL);
      if (!res.valid) {
        Object.assign(onCnclObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONCANCEL} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONCANCEL}`
      );
      if (!_.isEqual(dao.getValue("city"), on_cancel.context.city)) {
        onCnclObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONCANCEL}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONCANCEL}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_ONCANCEL} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_cancel.context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_ONCANCEL} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_ONCANCEL} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL}`
      );
      if (_.gte(dao.getValue("cnclTmpstmp"), on_cancel.context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.RET_CANCEL} api cannot be greater than or equal to /${constants.RET_ONCANCEL} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONCANCEL}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_cancel.context.transaction_id)) {
        onCnclObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONCANCEL} api, ${error.stack}`
      );
    }
    try {
      if (isSolicited) {
        logger.info(`Checking Message Id of /${constants.RET_ONCANCEL}`);
        if (!_.isEqual(dao.getValue("msgId"), on_cancel.context.message_id)) {
          onCnclObj.msgId = `Message Id for /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} api should be same`;
        }
        // if (msgIdSet.has(status.context.message_id)) {
        //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
        // }
        // msgId = status.context.message_id;
        msgIdSet.add(on_cancel.context.message_id);
      }
    } catch (error) {
      logger.error(
        `!!Error while checking message id for /${constants.RET_ONCANCEL}, ${error.stack}`
      );
    }
    on_cancel = on_cancel.message.order;

    try {
      logger.info(
        `Comparing order id in /${constants.RET_ONCANCEL} and /${constants.RET_CONFIRM}`
      );
      if (on_cancel.id != dao.getValue("cnfrmOrdrId")) {
        onCnclObj.onCancelId = `Order id in /${constants.RET_ONCANCEL} and /${constants.RET_CONFIRM} do not match`;
        logger.info(
          `Order id in /${constants.RET_ONCANCEL} and /${constants.RET_CONFIRM} do not match`
        );
      }
    } catch (error) {
      // onCnclObj.onCancelId =
      //   "Order id in /${constants.RET_ONCANCEL} and /${constants.RET_ONCONFIRM} do not match";
      logger.error(
        `!!Error while comparing order id in /${constants.RET_ONCANCEL} and /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      if (isSolicited) {
        logger.info(
          `Comparing cancellation reason id in /${constants.RET_ONCANCEL} and /${constants.RET_CANCEL}`
        );
        if (dao.getValue("cnclRid") != on_cancel.tags.cancellation_reason_id) {
          onCnclObj.onCancelRID = `Cancellation Reason Id in /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} should be same`;
        }
      } else {
        if (
          !utils.sellerCancellationRid.has(
            on_cancel.tags.cancellation_reason_id
          )
        ) {
          logger.info(
            `Cancellation Reason Id in /${constants.RET_ONCANCEL} is not a valid reason id`
          );

          onCnclObj.cancelRid = `cancellation_reason_id should be a valid cancellation id (unsolicited seller app initiated)`;
        }
      }
    } catch (error) {
      logger.error(
        `!!Error while checking cancellation reason id in  /${constants.RET_ONCANCEL}, ${error.stack}`
      );
      // onCnclObj.onCancelRID =
      //   "Cancellation reason Id in /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} (inside tags) should be same";
    }

    // dao.setValue("onCnclObj", onCnclObj);
    return onCnclObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_ONCANCEL} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONCANCEL} API`,
        err
      );
    }
  }
};

module.exports = checkOnCancel;
