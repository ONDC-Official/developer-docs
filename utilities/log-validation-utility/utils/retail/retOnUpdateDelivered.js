const constants = require("../constants");
const checkOnUpdate = require("./retOnUpdate");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const logger = require("../logger");

const checkOnUpdateDelivered = (dirPath, msgIdSet, state) => {
  try {
    let on_update = fs.readFileSync(
      dirPath + `/${constants.RET_ONUPDATE}_delivered.json`
    );
    let compareApi = `/${constants.RET_ONUPDATE}_delivered`;
    let isPickedApi = false;

    const initiatedOnUpdate = fs.existsSync(
      dirPath + `/${constants.RET_ONUPDATE}_initiated.json`
    );
    //setting comparison API to the previous recentmost API
    if (initiatedOnUpdate) {
      compareApi = `/${constants.RET_ONUPDATE}_initiated`;
    }

    const pickedOnUpdate = fs.existsSync(
      dirPath + `/${constants.RET_ONUPDATE}_picked.json`
    );

    if (pickedOnUpdate) {
      isPickedApi = true;
      compareApi = `/${constants.RET_ONUPDATE}_picked`;
    }

    //parsing the on_update call
    on_update = JSON.parse(on_update);

    let deliveredObj = {};
    deliveredObj = checkOnUpdate(msgIdSet, on_update, state);

    const contextTime = on_update.context.timestamp;
    on_update = on_update.message.order;
    //timestamp validations

    try {
      logger.info(
        `Comparing timestamp of ${compareApi}  and /${constants.RET_ONUPDATE}_${state} API`
      );
      if (_.gte(dao.getValue("tmstmp"), contextTime)) {
        deliveredObj.tmpstmp1 = `Timestamp for ${compareApi} api cannot be greater than or equal to /${constants.RET_ONUPDATE}_${state} api`;
      }
      dao.setValue("tmpstmp", contextTime);
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing context/timestamp for /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Checking delivery timestamp in /${constants.RET_ONUPDATE}_${state}`
      );
      const noOfFulfillments = on_update.fulfillments.length;
      let orderDelivered = false;
      let i = 0;
      let returnDeliveryTimestamps = {};
      let returnPickupTimestamps = {};

      while (i < noOfFulfillments) {
        const fulfillment = on_update.fulfillments[i];
        const ffState = fulfillment.state.descriptor.code;

        //type should be Delivery
        if (fulfillment.type != "Reverse QC") {
          i++;
          continue;
        }

        if (ffState === constants.ORDER_DELIVERED) {
          orderDelivered = true;
          const pickUpTime = fulfillment.start.time.timestamp;
          const deliveryTime = fulfillment.end.time.timestamp;
          returnDeliveryTimestamps[fulfillment.id] = deliveryTime;

          try {
            //checking delivery time matching with context timestamp
            if (!_.lte(deliveryTime, contextTime)) {
              deliveredObj.deliveryTime = `delivery timestamp should match context/timestamp and can't be future dated`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking delivery time matching with context timestamp in /${constants.RET_ONUPDATE}_${state}`,
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
              `!!Error while checking delivery time and pickup time in /${constants.RET_ONUPDATE}_${state}`,
              error
            );
          }

          try {
            if (isPickedApi) {
              returnPickupTimestamps = dao.getValue("returnPickupTimestamps");
              const orderPickedTime = returnPickupTimestamps[fulfillment.id];

              if (orderPickedTime && !_.isEqual(pickUpTime, orderPickedTime)) {
                deliveredObj.orderPickTime = `pickup time (/start/time/timestamp) can't change (should remain same as in "Return_Picked" state) `;
              }
            } else {
              returnPickupTimestamps[fulfillment.id] = pickUpTime;
            }
          } catch (error) {
            logger.error(
              `!!Error while comparing pickup time with pickup time in ${state} state`,
              error
            );
          }

          try {
            //checking order/updated_at timestamp
            if (!_.gte(on_update.updated_at, deliveryTime)) {
              deliveredObj.updatedAt = `order/updated_at timestamp can't be less than the delivery time`;
            }
            if (!_.gte(contextTime, on_update.updated_at)) {
              deliveredObj.updatedAtTime = `order/updated_at timestamp can't be future dated (should match context/timestamp)`;
            }
          } catch (error) {
            logger.error(
              `!!Error while checking order/updated_at timestamp in /${constants.RET_ONUPDATE}_${state}`,
              error
            );
          }
        }

        i++;
      }

      if (!isPickedApi) {
        dao.setValue("returnPickupTimestamps", returnPickupTimestamps);
      }

      dao.setValue("returnDeliveryTimestamps", returnDeliveryTimestamps);

      if (!orderDelivered) {
        deliveredObj.noOrdrDelivered = `fulfillments/state should be "${constants.ORDER_DELIVERED}" for /${constants.RET_ONUPDATE}_${state}`;
      }
    } catch (error) {
      logger.error(
        `!! Error while checking delivery timestamp in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
      );
    }

    return deliveredObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.error(
        `!!File not found for /${constants.RET_ONUPDATE}_${state} API!`
      );
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONUPDATE}_${state} API ${err.stack}`
      );
    }
  }
};

module.exports = checkOnUpdateDelivered;
