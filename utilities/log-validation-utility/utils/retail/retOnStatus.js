const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");
const logger = require("../logger");

const checkOnStatus = (msgIdSet, on_status, state) => {
  let onStatObj = {};
  let cntxtTmpstmp = "";

  try {
    logger.info(
      `Validating Schema for /${constants.RET_ONSTATUS}_${state} API`
    );
    const vs = validateSchema("retail", constants.RET_ONSTATUS, on_status);
    if (vs != "error") {
      // logger.info(vs);
      Object.assign(onStatObj, vs);
    }
  } catch (error) {
    logger.info(
      `!!Error occurred while performing schema validation for /${constants.RET_ONSTATUS}_${state}`,
      error
    );
  }

  try {
    logger.info(`Checking context for /${constants.RET_ONSTATUS}_${state} API`); //checking context
    res = checkContext(on_status.context, "on_status");
    if (!res.valid) {
      Object.assign(onStatObj, res.ERRORS);
    }
  } catch (error) {
    logger.info(
      `!!Some error occurred while checking /${constants.RET_ONSTATUS}_${state} context`,
      error
    );
  }

  try {
    logger.info(
      `Comparing city of ${constants.RET_SEARCH} and /${constants.RET_ONSTATUS}_${state}`
    );
    if (!_.isEqual(dao.getValue("city"), on_status.context.city)) {
      onStatObj.city = `City code mismatch in ${constants.RET_SEARCH} and /${constants.RET_ONSTATUS}_${state}`;
    }
  } catch (error) {
    logger.info(
      `!!Error while comparing city in ${constants.RET_SEARCH} and /${constants.RET_ONSTATUS}_${state}`,
      error
    );
  }

  try {
    logger.info(
      `Comparing timestamp of /${constants.RET_ONSTATUS}_${state} and /${constants.RET_ONCONFIRM}`
    );
    if (_.gte(dao.getValue("tmpstmp"), on_status.context.timestamp)) {
      onStatObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_ONSTATUS}_${state} api`;
    }
    cntxtTmpstmp = on_status.context.timestamp;
  } catch (error) {
    logger.info(
      `Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_ONSTATUS}_${state} api`,
      error
    );
  }

  // try {
  //   logger.info(
  //     `Comparing timestamp of /${constants.RET_STATUS} and /${constants.RET_ONSTATUS}_${state}`
  //   );
  //   if (_.gte(dao.getValue("statTmpstmp"), on_status.context.timestamp)) {
  //     onStatObj.tmpstmp = `Timestamp for /${constants.RET_STATUS} api cannot be greater than or equal to /${constants.RET_ONSTATUS}_${state} api`;
  //   }
  // } catch (error) {
  //   logger.info(
  //     `!!Error while comparing timestamp for /${constants.RET_STATUS} and /${constants.RET_ONSTATUS}_${state} api`,
  //     error
  //   );
  // }

  try {
    logger.info(
      `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONSTATUS}_${state}`
    );
    if (!_.isEqual(dao.getValue("txnId"), on_status.context.transaction_id)) {
      onStatObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
    }
  } catch (error) {
    logger.info(
      `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONSTATUS}_${state} api`,
      error
    );
  }

  try {
    logger.info(`Checking Message Id of /${constants.RET_ONSTATUS}_${state}`);
    // if (!_.isEqual(dao.getValue("msgId"), on_status.context.message_id)) {
    //   onStatObj.msgId = `Message Id for /${constants.RET_STATUS} and /${constants.RET_ONSTATUS}_${state} api should be same`;
    // }

    if (msgIdSet.has(on_status.context.message_id)) {
      onStatObj.msgId2 = "Message Id cannot be same for different sets of APIs";
    }
    // msgId = status.context.message_id;
    msgIdSet.add(on_status.context.message_id);
  } catch (error) {
    logger.info(
      `!!Error while checking message id for /${constants.RET_ONSTATUS}_${state}`,
      error
    );
  }

  on_status = on_status.message.order;

  try {
    logger.info(
      `Comparing order Id in /${constants.RET_ONCONFIRM} and /${constants.RET_ONSTATUS}_${state}`
    );
    if (on_status.id != dao.getValue("cnfrmOrdrId")) {
      logger.info(
        `Order id (/${constants.RET_ONSTATUS}_${state}) mismatches with /${constants.RET_CONFIRM})`
      );
      onStatObj.onStatusOdrId = `Order id in /${constants.RET_CONFIRM} and /${constants.RET_ONSTATUS}_${state} do not match`;
    }
  } catch (error) {
    logger.info(
      `!!Error while comparing order id in /${constants.RET_ONSTATUS}_${state} and /${constants.RET_CONFIRM}`,
      error
    );
  }
  // try {
  //   logger.info(`Checking order state in /${constants.RET_ONSTATUS}_${state}`);
  //   if (!utils.retailOrderState.includes(on_status.state)) {
  //     onStatObj.ordrSt = `Order State in /${constants.RET_ONSTATUS}_${state} is not as per the API Contract`;
  //   }
  // } catch (error) {
  //   // onStatObj.ordrSt = `Order State (/${constants.RET_ONSTATUS}_${state}) should be as per the API Contract`;
  //   logger.info(
  //     `!!Error while checking order state in /${constants.RET_ONSTATUS}_${state}`,
  //     error
  //   );
  // }

  try {
    logger.info(
      `Comparing billing object in ${constants.RET_CONFIRM} and /${constants.RET_ONSTATUS}_${state}`
    );
    const billing = dao.getValue("billing");
    if (utils.isObjectEqual(billing, on_status.billing).length>0) {
      const billingMismatch= utils.isObjectEqual(billing, on_status.billing);
      onStatObj.bill = `${billingMismatch.join(", ")} mismatches in /billing in /${constants.RET_CONFIRM} and /${constants.RET_ONSTATUS}_${state}`;
    }
    // dao.setValue("billing", on_confirm.billing);
  } catch (error) {
    logger.info(
      `!Error while comparing billing object in /${constants.RET_CONFIRM} and /${constants.RET_ONSTATUS}_${state}`
    );
  }

  try {
    logger.info(
      `Checking provider id and location in /${constants.RET_ONSTATUS}_${state}`
    );
    if (!_.isEqual(on_status.provider.id, dao.getValue("providerId"))) {
      onStatObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONSTATUS}_${state}`;
    }

    if (
      !_.isEqual(
        on_status.provider.locations[0].id,
        dao.getValue("providerLoc")
      )
    ) {
      onStatObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONSTATUS}_${state}`;
    }
  } catch (error) {
    logger.info(
      `!!Error while checking provider id and location in /${constants.RET_ONSTATUS}_${state}`,
      error
    );
  }

  try {
    //checking order timestamps in /on_status
    if (!_.isEqual(on_status.created_at, dao.getValue("ordrCrtd"))) {
      onStatObj.crtdTmstmp = `order/created_at timestamp can't change (should remain same as in /${constants.RET_CONFIRM})`;
    }

    if (_.gte(on_status.created_at, on_status.updated_at)) {
      onStatObj.ordrTmstmp = `order created_at timestamp must always be earlier than the updated_at timestamp`;
    }
  } catch (error) {
    logger.info(
      `!!Error while checking order timestamps in /${constants.RET_ONSTATUS}_${state}`
    );
  }

  // try {
  //   logger.info(`Checking Fulfillments state in /${constants.RET_ONSTATUS}_${state}`);
  //   on_status.fulfillments.forEach((element, indx) => {
  //     logger.info(`Checking fulfillment state for Id ${element.id}`);
  //     if (
  //       !utils.retailFulfillmentState.includes(element.state.descriptor.code)
  //     ) {
  //       onStatObj.ffStatusState = `Fulfillment State Code in /${constants.RET_ONSTATUS}_${state} is not as per the API Contract`;
  //     } else {
  //       const ffState = element.state.descriptor.code;
  //       if (ffState === "Order-picked-up") {
  //         const pickupTime = element.start.time.timestamp;
  //         if (pickupTime != cntxtTmpstmp) {
  //           onStatObj.ffTmpstmps = `pickup time /fulfillments[${indx}]/start/time/timestamp must match context/timestamp when fulfillment state is ${ffState} `;
  //         }
  //         if (pickupTime != on_status.updated_at) {
  //           onStatObj.updtdTmpstmps = `order/updated_at timestamp must match context/timestamp when fulfillment state is ${ffState} `;
  //         }
  //       } else if (ffState === "Order-delivered") {
  //         const deliveryTime = element.end.time.timestamp;
  //         if (deliveryTime != cntxtTmpstmp) {
  //           onStatObj.ffTmpstmps = `delivery time /fulfillments[${indx}]/end/time/timestamp must match context/timestamp when fulfillment state is ${ffState} `;
  //         }
  //         if (deliveryTime != on_status.updated_at) {
  //           onStatObj.updtdTmpstmps = `order/updated_at timestamp must match context/timestamp when fulfillment state is ${ffState} `;
  //         }
  //       }
  //     }
  //   });
  // } catch (error) {
  //   logger.info(
  //     `Fulfillment state Code (/${constants.RET_ONSTATUS}_${state}) should be as per the API Contract.`,
  //     error
  //   );
  // }

  return onStatObj;
  // dao.setValue("onStatObj", onStatObj);
};

module.exports = checkOnStatus;
