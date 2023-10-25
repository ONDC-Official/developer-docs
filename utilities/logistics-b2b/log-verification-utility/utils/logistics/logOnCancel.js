const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkOnCancel = (data, msgIdSet) => {
  let onCancelObj = {};
  let on_cancel = data;
  let contextTime = on_cancel.context.timestamp;
  let messageId = on_cancel.context.message_id;

  on_cancel = on_cancel.message.order;
  let ffState;
  let orderState = on_cancel.state;
  let items = on_cancel.items;
  let fulfillments = on_cancel.fulfillments;
  let  RtoPickupTime;


  try {
    if (fulfillments.length > 1) {
      console.log(
        `Checking for a valid 'Cancelled' fulfillment state for type 'Delivery' in case of RTO`
      );
      fulfillments.forEach((fulfillment) => {
        ffState = fulfillment?.state?.descriptor?.code;
        if ((fulfillment.type === "Prepaid" || fulfillment.type === "Delivery") && ffState !== "Cancelled") {
          onCancelObj.flflmntstErr = `In case of RTO, fulfillment with type '${fulfillment.type}' needs to be 'Cancelled'`;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  try {
    fulfillments.forEach((fulfillment) => {
      ffState = fulfillment?.state?.descriptor?.code;
      console.log(
        `Comparing pickup and delivery timestamps for on_cancel_${ffState}`
      );

      if (fulfillment.type === "Prepaid" || fulfillment.type === "CoD" || fulfillment.type === "Delivery") {
       
        if (ffState === "Cancelled") {
          if (orderState !== "Cancelled") {
            onCancelObj.ordrStatErr = `Order state should be 'Cancelled' for fulfillment state - ${ffState}`;
          }
          if (fulfillments.length > 1) {
            if (!fulfillment.start.time.timestamp) {
              onCancelObj.msngPickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is missing for fulfillment state - ${ffState}`;
            }
          }

          if (fulfillment.start.time.timestamp && dao.getValue("pickupTime")) {
            if (
              !_.isEqual(
                dao.getValue("pickupTime"),
                fulfillment.start.time.timestamp
              )
            ) {
              onCancelObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
            }
          }
    
        }
      } else if (fulfillment.type === "RTO" || fulfillment.type === "Return") {
        if (orderState !== "Cancelled") {
          onCancelObj.ordrStatErr = `Order state should be 'Cancelled' for fulfillment state - ${ffState}`;
        }
        if (ffState === "RTO-Initiated") {
          RtoPickupTime = fulfillment?.start?.time?.timestamp;
          console.log(RtoPickupTime);
          if (RtoPickupTime) {
            dao.setValue("RtoPickupTime", RtoPickupTime);
          } else {
            onCancelObj.rtoPickupTimeErr = `RTO Pickup (fulfillments/start/time/timestamp) time is missing for fulfillment state - ${ffState}`;
          }
          if (_.gt(RtoPickupTime, contextTime)) {
            onCancelObj.rtoPickupErr = `RTO Pickup (fulfillments/start/time/timestamp) time cannot be future dated for fulfillment state - ${ffState}`;
          }
        }
      }
    });
  } catch (error) {
    console.log(`Error checking fulfillments/start in /on_cancel`);
  }

  return onCancelObj;
};

module.exports = checkOnCancel;
