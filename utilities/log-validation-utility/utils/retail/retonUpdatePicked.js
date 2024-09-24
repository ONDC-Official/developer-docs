const constants = require("../constants");
const checkOnUpdate = require("./retOnUpdate");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const logger = require("../logger");

const checkOnUpdatePicked = (dirPath, msgIdSet, state) => {
  try {
    let on_update = fs.readFileSync(
      dirPath + `/${constants.RET_ONUPDATE}_picked.json`
    );
    let compareApi = `/${constants.RET_ONSTATUS}_delivered`;

    const initiatedOnUpdate = fs.existsSync(
      dirPath + `/${constants.RET_ONUPDATE}_initiated.json`
    );
    //setting comparison API to the previous recentmost API
    if (initiatedOnUpdate) {
      compareApi = `/${constants.RET_ONUPDATE}_initiated`;
    }

    //parsing the on_update call
    on_update = JSON.parse(on_update);

    let pickedObj = {};
    pickedObj = checkOnUpdate(msgIdSet, on_update, state);

    const contextTime = on_update.context.timestamp;
    on_update = on_update.message.order;
    //timestamp validations

    try {
      let refundTriggering = {};
      refundTriggering[state] = contextTime;
      dao.setValue("refundTriggering", refundTriggering);
    } catch (error) {
      logger.error(
        `Error while saving timestmap for refund triggering state ${state} `
      );
    }

    try {
      logger.info(
        `Comparing timestamp of ${compareApi}  and /${constants.RET_ONUPDATE}_${state} API`
      );
      if (_.gte(dao.getValue("tmstmp"), contextTime)) {
        pickedObj.tmpstmp1 = `Timestamp for ${compareApi} api cannot be greater than or equal to /${constants.RET_ONUPDATE}_${state} api`;
      }
      dao.setValue("tmpstmp", contextTime);
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing context/timestamp for /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Checking pickup timestamp in /${constants.RET_ONUPDATE}_${state}`
      );
      const noOfFulfillments = on_update.fulfillments.length;
      let orderPicked = false;
      let i = 0;
      let returnPickupTimestamps = {};

      while (i < noOfFulfillments) {
        const fulfillment = on_update.fulfillments[i];
        const ffState = fulfillment.state.descriptor.code;

        //type should be Delivery
        if (fulfillment.type != "Reverse QC") {
          i++;
          continue;
        }

        if (ffState === constants.ORDER_PICKED) {
          orderPicked = true;
          const pickUpTime = fulfillment.start.time.timestamp;
          returnPickupTimestamps[fulfillment.id] = pickUpTime;

          try {
            //checking pickup time matching with context timestamp
            if (!_.lte(pickUpTime, contextTime)) {
              pickedObj.pickupTime = `pickup timestamp should match context/timestamp and can't be future dated`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking pickup time matching with context timestamp in /${constants.RET_ONUPDATE}_${state}`,
              error
            );
          }

          try {
            //checking order/updated_at timestamp
            if (!_.gte(on_update.updated_at, pickUpTime)) {
              pickedObj.updatedAt = `order/updated_at timestamp can't be less than the pickup time`;
            }
            if (!_.gte(contextTime, on_update.updated_at)) {
              pickedObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking order/updated_at timestamp in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
            );
          }
        }

        i++;
      }

      dao.setValue("returnPickupTimestamps", returnPickupTimestamps);

      if (!orderPicked) {
        pickedObj.noOrdrPicked = `fulfillments/state should be "${constants.ORDER_PICKED}" for /${constants.RET_ONSTATUS}_${state}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking pickup timestamp in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
      );
    }

    return pickedObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.error(
        `!!File not found for /${constants.RET_ONUPDATE}_${state} API!`
      );
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONUPDATE}_${state} API`,
        err
      );
    }
  }
};

module.exports = checkOnUpdatePicked;
