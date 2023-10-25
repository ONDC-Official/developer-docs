const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkOnStatus = (data, msgIdSet) => {
  let onStatusObj = {};
  let on_status = data;
  let contextTime = on_status.context.timestamp;
  let messageId = on_status.context.message_id;

  on_status = on_status.message.order;
  let ffState;
  let orderState = on_status.state;
  let items = on_status.items;
  let fulfillments = on_status.fulfillments;
  let pickupTime, deliveryTime, RtoPickupTime, RtoDeliveredTime;


  try {
    if (fulfillments.length > 1) {
      console.log(
        `Checking for a valid 'Cancelled' fulfillment state for type 'Delivery' in case of RTO`
      );
      fulfillments.forEach((fulfillment) => {
        ffState = fulfillment?.state?.descriptor?.code;
        if ((fulfillment.type === "Prepaid" || fulfillment.type === "Delivery") && ffState !== "Cancelled") {
          onStatusObj.flflmntstErr = `In case of RTO, fulfillment with type 'Delivery/Prepaid' needs to in 'Cancelled' state`;
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
        `Comparing pickup and delivery timestamps for on_status_${ffState}`
      );

      if (fulfillment.type === "Prepaid" || fulfillment.type === "CoD" || fulfillment.type === "Delivery") {
        if (ffState === "Pending" || ffState === "Agent-assigned") {
          if (fulfillment?.start?.time?.timestamp) {
            onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
          }
          if (fulfillment?.end?.time?.timestamp) {
            onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
          }
        }
        if (ffState === "Order-picked-up") {
          if (orderState !== "In-progress") {
            onStatusObj.ordrStatErr = `Order state should be 'In-progress' for fulfillment state - ${ffState}`;
          }
          pickupTime = fulfillment?.start?.time?.timestamp;
          dao.setValue("pickupTime", pickupTime);
          if (!pickupTime) {
            onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is required for fulfillment state - ${ffState}`;
          }

          if (_.gt(pickupTime, contextTime)) {
            onStatusObj.tmstmpErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be future dated w.r.t context/timestamp for fulfillment state - ${ffState}`;
          }
          if (fulfillment?.end?.time?.timestamp) {
            onStatusObj.delvryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
          }
        }
        if (ffState === "Out-for-delivery") {
        
          if (orderState !== "In-progress") {
            onStatusObj.ordrStatErr = `Order state should be 'In-progress' for fulfillment state - ${ffState}`;
          }
          if (!fulfillment?.start?.time?.timestamp) {
            {
              onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is missing for fulfillment state - ${ffState}`;
            }
          } else if (
            dao.getValue("pickupTime") &&
            fulfillment?.start?.time?.timestamp !== dao.getValue("pickupTime")
          ) {
            onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
          }

          if (fulfillment?.end?.time?.timestamp) {
            onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
          }
        }
        if (ffState === "Order-delivered") {
          if (orderState !== "Completed") {
            onStatusObj.ordrStatErr = `Order state should be 'Completed' for fulfillment state - ${ffState}`;
          }
          deliveryTime = fulfillment?.end?.time?.timestamp;

          dao.setValue("deliveryTime", deliveryTime);
           if (!fulfillment?.start?.time?.timestamp) {
            {
              onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is missing for fulfillment state - ${ffState}`;
            }
          } else if (
            fulfillment?.start?.time?.timestamp !== dao.getValue("pickupTime")
          ) {
            onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
          }

          if (!deliveryTime) {
            onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) is required for fulfillment state - ${ffState}`;
          }
          if (_.gt(deliveryTime, contextTime)) {
            onStatusObj.tmstmpErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be future dated w.r.t context/timestamp for fulfillment state - ${ffState}`;
          }
          if (_.gte(pickupTime, deliveryTime)) {
            onStatusObj.tmstmpErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be greater than or equal to  delivery timestamp (fulfillments/end/time/timestamp) for fulfillment state - ${ffState}`;
          }
        }
        if (ffState === "Cancelled") {
          if (orderState !== "Cancelled") {
            onStatusObj.ordrStatErr = `Order state should be 'Cancelled' for fulfillment state - ${ffState}`;
          }
          if (fulfillments.length > 1) {
            if (!dao.getValue("pickupTime")) {
              onStatusObj.msngPickupState = `/on_status call for Fulfillment state - 'Order-picked-up' missing`;
            } else if (!fulfillment.start.time.timestamp) {
              onStatusObj.msngPickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is missing for fulfillment state - ${ffState}`;
            }
          }

          if (fulfillment.start.time.timestamp && dao.getValue("pickupTime")) {
            if (
              !_.isEqual(
                dao.getValue("pickupTime"),
                fulfillment.start.time.timestamp
              )
            ) {
              onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
            }
          }
          if (fulfillment.end.time.timestamp && dao.getValue("deliveryTime")) {
            if (
              !_.isEqual(
                dao.getValue("delivryTime"),
                fulfillment.end.time.timestamp
              )
            ) {
              onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot change for fulfillment state - ${ffState}`;
            }
          }
        }
      } else if (fulfillment.type === "RTO" || fulfillment.type === "Return") {
        if (orderState !== "Cancelled") {
          onStatusObj.ordrStatErr = `Order state should be 'Cancelled' for fulfillment state - ${ffState}`;
        }
        if (ffState === "RTO-Initiated" && fulfillment.type === "Prepaid" ) {
          RtoPickupTime = fulfillment?.start?.time?.timestamp;
          console.log(RtoPickupTime);
          if (RtoPickupTime) {
            dao.setValue("RtoPickupTime", RtoPickupTime);
          } else {
            onStatusObj.rtoPickupTimeErr = `RTO Pickup (fulfillments/start/time/timestamp) time is missing for fulfillment state - ${ffState}`;
          }
          if (_.gt(RtoPickupTime, contextTime)) {
            onStatusObj.rtoPickupErr = `RTO Pickup (fulfillments/start/time/timestamp) time cannot be future dated for fulfillment state - ${ffState}`;
          }
        }
      
        if (ffState === "RTO-Delivered" || ffState === "RTO-Disposed") {
          RtoDeliveredTime = fulfillment?.end?.time?.timestamp;
          if (!RtoDeliveredTime && ffState === "RTO-Delivered")
            onStatusObj.rtoDlvryTimeErr = `RTO Delivery timestamp (fulfillments/end/time/timestamp) is missing for fulfillment state - ${ffState}`;
          if (
            fulfillment.start.time.timestamp &&
            dao.getValue("RtoPickupTime")
          ) {
            if (
              !_.isEqual(
                fulfillment.start.time.timestamp,
                dao.getValue("RtoPickupTime")
              )
            ) {
              onStatusObj.rtoPickupErr = `RTO Pickup time (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
            }
          }
          if (RtoDeliveredTime && _.gt(RtoDeliveredTime, contextTime)) {
            onStatusObj.rtoDeliveredErr = `RTO Delivery time (fulfillments/end/time/timestamp) cannot be future dated for fulfillment state - ${ffState}`;
          }
        }
      }
    });
  } catch (error) {
    console.log(`Error checking fulfillments/start in /on_status`);
  }

  return onStatusObj;
};

module.exports = checkOnStatus;
