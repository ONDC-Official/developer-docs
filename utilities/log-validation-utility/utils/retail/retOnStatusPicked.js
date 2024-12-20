// Order picked on status

const checkOnStatus = require("./retOnStatus");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const logger = require("../logger");

const checkOnStatusPicked = (dirPath, msgIdSet, state) => {
  try {
    let on_status = fs.readFileSync(
      dirPath + `/${constants.RET_ONSTATUS}_${state}.json`
    );
    let compareApi = `/${constants.RET_ONCONFIRM}`;
    let isPendingApi = false;

    const pendingOnstatus = fs.existsSync(
      dirPath + `/${constants.RET_ONSTATUS}_pending.json`
    );

    //setting comparison API to the previous recentmost API
    if (pendingOnstatus) {
      isPendingApi = true;
      compareApi = `/${constants.RET_ONSTATUS}_pending`;
    }

    //parsing the on_status call
    on_status = JSON.parse(on_status);

    let pickedupObj = {};
    pickedupObj = checkOnStatus(msgIdSet, on_status, state);

    const contextTime = on_status.context.timestamp;
    on_status = on_status.message.order;
    //timestamp validations

    try {
      logger.info(
        `Comparing timestamp of ${compareApi}  and /${constants.RET_ONSTATUS}_${state} API`
      );
      if (_.gte(dao.getValue("tmstmp"), contextTime)) {
        pickedupObj.tmpstmp1 = `Timestamp for ${compareApi} api cannot be greater than or equal to /${constants.RET_ONSTATUS}_${state} api`;
      }
      dao.setValue("tmpstmp", contextTime);
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing context/timestamp for /${constants.RET_ONSTATUS}_${state}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Checking order state in /${constants.RET_ONSTATUS}_${state}`
      );
      if (on_status.state != "In-progress") {
        pickedupObj.ordrState = `order/state should be "In-progress" for /${constants.RET_ONSTATUS}_${state}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking order state in /${constants.RET_ONSTATUS}_${state}`
      );
    }

    try {
      logger.info(
        `Checking pickup timestamp in /${constants.RET_ONSTATUS}_${state}`
      );
      const noOfFulfillments = on_status.fulfillments.length;
      let orderPicked = false;
      let i = 0;
      let pickupTimestamps = {};

      while (i < noOfFulfillments) {
        const fulfillment = on_status.fulfillments[i];
        const ffState = fulfillment.state.descriptor.code;

        //type should be Delivery
        if (fulfillment.type != "Delivery") {
          i++;
          continue;
        }

        if (ffState === constants.ORDER_PICKED) {
          orderPicked = true;
          const pickUpTime = fulfillment.start.time.timestamp;
          pickupTimestamps[fulfillment.id] = pickUpTime;

          try {
            //checking pickup time matching with context timestamp
            if (!_.lte(pickUpTime, contextTime)) {
              pickedupObj.pickupTime = `pickup timestamp should match context/timestamp and can't be future dated`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking pickup time matching with context timestamp in /${constants.RET_ONSTATUS}_${state}`,
              error
            );
          }

          try {
            //checking order/updated_at timestamp
            if (!_.gte(on_status.updated_at, pickUpTime)) {
              pickedupObj.updatedAt = `order/updated_at timestamp can't be less than the pickup time`;
            }
            if (!_.gte(contextTime, on_status.updated_at)) {
              pickedupObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking order/updated_at timestamp in /${constants.RET_ONSTATUS}_${state}`,
              error
            );
          }
        }

        i++;
      }

      dao.setValue("pickupTimestamps", pickupTimestamps);

      if (!orderPicked) {
        pickedupObj.noOrdrPicked = `fulfillments/state should be Order-picked-up for /${constants.RET_ONSTATUS}_${state}`;
      }
    } catch (error) {
      logger.info(
        `Error while checking pickup timestamp in /${constants.RET_ONSTATUS}_${state}.json`
      );
    }

    return pickedupObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.error(
        `!!File not found for /${constants.RET_ONSTATUS}_${state} API!`
      );
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONSTATUS}_${state} API`,
        err
      );
    }
  }
};

module.exports = checkOnStatusPicked;
