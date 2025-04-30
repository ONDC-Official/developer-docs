const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const constants = require("../constants");
const logger = require("../logger");

const checkUpdateBilling = (dirPath, msgIdSet) => {
  let updtObj = {};

  try {
    let update = fs.readFileSync(
      dirPath + `/${constants.RET_UPDATE}_billing.json`
    );
    update = JSON.parse(update);

    try {
      logger.info(`Validating Schema for ${constants.RET_UPDATE} API`);
      const vs = validateSchema("retail", constants.RET_UPDATE, update);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(updtObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_UPDATE}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking context for /${constants.RET_UPDATE} API`); //checking context
      res = checkContext(update.context, constants.RET_UPDATE);
      if (!res.valid) {
        Object.assign(updtObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_UPDATE} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_UPDATE}`
      );
      if (!_.isEqual(dao.getValue("city"), update.context.city)) {
        updtObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_UPDATE}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_UPDATE}, ${error.stack}`
      );
    }

    try {
      const refundTriggering = dao.getValue("refundTriggering");
      const refundState = Object.keys(refundTriggering)[0];
      const refundTime = refundTriggering[refundState];
      logger.info(
        `Comparing timestamp of /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}_${refundState}`
      );
      if (_.lte(update.context.timestamp, refundTime)) {
        updtObj.tmpstmp = `/update for refund should only be triggered after the triggering state ${refundState} `;
      }
    } catch (error) {
      logger.info(
        `Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_ONUPDATE}_${refundState} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_UPDATE}`
      );
      if (!_.isEqual(dao.getValue("txnId"), update.context.transaction_id)) {
        statObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_UPDATE} api, ${error.stack}`
      );
    }
    try {
      logger.info(`Checking Message Id of /${constants.RET_UPDATE}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for ${constants.RET_SELECT} and /on_select api should be same";
      // }

      if (msgIdSet.has(update.context.message_id)) {
        updtObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", update.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      logger.error(
        `!!Error while checking message id for /${constants.RET_UPDATE}, ${error.stack}`
      );
    }

    update = update.message.order;

    // dao.setValue("updtObj", updtObj);

    try {
      logger.info(
        `Checking refund settlement amount in /${constants.RET_UPDATE}_billing`
      );

      const updatedPrice = parseFloat(dao.getValue("updatedQuotePrice"));
      const actualQuotePrice = parseFloat(dao.getValue("quotePrice"));

      const refundAmount = _.subtract(actualQuotePrice, updatedPrice);

      const has = Object.prototype.hasOwnProperty;
      if (!has.call(update, "payment")) {
        updtObj.pymnt = `/payment object is mandatory for settlement of refund`;
      } else {
        if (!has.call(update.payment, "@ondc/org/settlement_details")) {
          updtObj.pymnt = `@ondc/org/settlement_details in /payment is mandatory for settlement of refund`;
        } else {
          const settlementAmount = parseFloat(
            update.payment["@ondc/org/settlement_details"][0][
              "settlement_amount"
            ]
          );

          if (!_.isEqual(settlementAmount, refundAmount)) {
            updtObj.refundAmountMismatch = `Inaccurate calculation of refund amount (pls check the quote price in refund triggering state)`;
          }
        }
      }
    } catch (error) {
      logger.error(
        `!!Error while checking refund settlement amount in /${constants.RET_UPDATE}_billing, ${error.stack}`
      );
    }

    return updtObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_UPDATE}_billing API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_UPDATE}_billing API`,
        err
      );
    }
  }
};

module.exports = checkUpdateBilling;
