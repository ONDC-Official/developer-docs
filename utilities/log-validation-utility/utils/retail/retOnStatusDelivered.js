const checkOnStatus = require("./retOnStatus");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const logger = require("../logger");
const constants = require("../constants");

const checkOnStatusDelivered = (dirPath, msgIdSet, state) => {
  try {
    let on_status = fs.readFileSync(
      dirPath + `/${constants.RET_ONSTATUS}_${state}.json`
    );
    let compareApi = `/${constants.RET_ONCONFIRM}`;
    let isPickedApi = false;

    const pickedOnStatus = fs.existsSync(
      dirPath + `/${constants.RET_ONSTATUS}_picked.json`
    );
    //setting comparison API to the previous recentmost API
    if (pickedOnStatus) {
      isPickedApi = true;
      compareApi = `/${constants.RET_ONSTATUS}_picked`;
    } else {
      const pendingOnStatus = fs.existsSync(
        dirPath + `/${constants.RET_ONSTATUS}_pending.json`
      );
      if (pendingOnStatus) compareApi = `/${constants.RET_ONSTATUS}_pending`;
    }
    //parsing the on_status call
    on_status = JSON.parse(on_status);

    let deliveredObj = {};
    deliveredObj = checkOnStatus(msgIdSet, on_status, state);
    const contextTime = on_status.context.timestamp;
    on_status = on_status.message.order;

    try {
      logger.info(
        `comparing context/timestamp of /${constants.RET_ONSTATUS}_${state} and ${compareApi}`
      );
      const tmpstmp = dao.getValue("tmpstmp");
      if (_.gte(tmpstmp, contextTime)) {
        deliveredObj.tmpstmp = `context/timestamp of ${compareApi} api cannot be greater than or equal to /${constants.RET_ONSTATUS}_${state} api`;
      }
      dao.setValue("tmpstmp", contextTime);
    } catch (error) {
      logger.error(
        `!!Error while comparing context/timestamp of /${constants.RET_ONSTATUS}_${state} and ${compareApi}`
      );
    }

    try {
      logger.info(
        `Checking order state in /${constants.RET_ONSTATUS}_${state}`
      );
      if (on_status.state != "Completed") {
        deliveredObj.ordrState = `order/state should be "Completed" for /${constants.RET_ONSTATUS}_${state}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking order state in /${constants.RET_ONSTATUS}_${state}`
      );
    }

    try {
      logger.info(
        `Checking delivery timestamp in /${constants.RET_ONSTATUS}_${state}`
      );
      const noOfFulfillments = on_status.fulfillments.length;
      let orderDelivered = false;
      let i = 0;
      let deliveryTimestamps = {};
      let pickupTimestamps = {};

      while (i < noOfFulfillments) {
        const fulfillment = on_status.fulfillments[i];
        const ffState = fulfillment.state.descriptor.code;

        //type should be Delivery
        if (fulfillment.type != "Delivery") {
          i++;
          continue;
        }

        if (ffState === constants.ORDER_DELIVERED) {
          orderDelivered = true;
          const pickUpTime = fulfillment.start.time.timestamp;
          const deliveryTime = fulfillment.end.time.timestamp;
          deliveryTimestamps[fulfillment.id] = deliveryTime;

          // dao.setValue("deliveredTime",deliveryTime);

          try {
            //checking delivery time matching with context timestamp
            if (!_.lte(deliveryTime, contextTime)) {
              deliveredObj.deliveryTime = `delivery timestamp should match context/timestamp and can't be future dated`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking delivery time matching with context timestamp in /${constants.RET_ONSTATUS}_${state}`,
              error
            );
          }

          try {
            //checking delivery time and pickup time
            if (_.gte(pickUpTime, deliveryTime)) {
              deliveredObj.delPickTime = `delivery timestamp (/end/time/timestamp) can't be less than or equal to the pickup timestamp (start/time/timestamp)`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking delivery time and pickup time in /${constants.RET_ONSTATUS}_${state}`,
              error
            );
          }

          try {
            if (isPickedApi) {
              pickupTimestamps = dao.getValue("pickupTimestamps");
              const orderPickedTime = pickupTimestamps[fulfillment.id];

              if (orderPickedTime && !_.isEqual(pickUpTime, orderPickedTime)) {
                deliveredObj.orderPickTime = `pickup time (/start/time/timestamp) can't change (should remain same as in "Order-picked-up" state) `;
              }
            } else {
              pickupTimestamps[fulfillment.id] = pickUpTime;
            }
          } catch (error) {
            logger.error(
              `!!Error while comparing pickup time with pickup time in Order-picked-up state`,
              error
            );
          }

          try {
            //checking order/updated_at timestamp
            if (!_.gte(on_status.updated_at, deliveryTime)) {
              deliveredObj.updatedAt = `order/updated_at timestamp can't be less than the delivery time`;
            }
            if (!_.gte(contextTime, on_status.updated_at)) {
              deliveredObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`;
            }
          } catch (error) {
            logger.info(
              `!!Error while checking order/updated_at timestamp in /${constants.RET_ONSTATUS}_${state}`,
              error
            );
          }
        }

        i++;
      }

      if (!isPickedApi) {
        dao.setValue("pickupTimestamps", pickupTimestamps);
      }

      dao.setValue("deliveryTimestamps", deliveryTimestamps);

      if (!orderDelivered) {
        deliveredObj.noOrdrDelivered = `fulfillments/state should be Order-delivered for /${constants.RET_ONSTATUS}_${state}`;
      }
    } catch (error) {
      logger.info(
        `Error while checking delivery timestamp in /${constants.RET_ONSTATUS}_${state}.json`
      );
    }

    return deliveredObj;

    //timestamp validations
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

module.exports = checkOnStatusDelivered;
