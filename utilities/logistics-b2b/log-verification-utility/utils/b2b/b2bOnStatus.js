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
  let payments = on_status?.payments;
  let invoice = on_status?.documents;
  let rfq= dao.getValue("rfq")

  try {
    console.log(`Checking payment object in /on_status`);
    payments.forEach((payment) => {
      let paymentStatus = payment?.status;
      let paymentType = payment?.type;
      let params = payment?.params;

      if (paymentStatus === "PAID" && !params?.transaction_id) {
        onStatusObj.pymntErr = `Transaction ID in payments/params is required when the payment status is 'PAID'`;
      }
      if (paymentStatus === "NOT-PAID" && params?.transaction_id) {
        onStatusObj.pymntErr = `Transaction ID in payments/params cannot be provided when the payment status is 'NOT-PAID'`;
      }
      if (
        paymentType === "ON-FULFILLMENT" &&
        orderState != "Completed" &&
        paymentStatus === "PAID"
      ) {
        onStatusObj.pymntstsErr = `Payment status will be 'PAID' once the order is 'Completed' for payment type 'ON-FULFILLMENT'`;
      }
    });
  } catch (error) {
    console.log(error);
  }

  try {
    fulfillments.forEach((fulfillment) => {
      ffState = fulfillment?.state?.descriptor?.code;
      console.log(
        `Comparing pickup and delivery timestamps for on_status_${ffState}`
      );
      //Pending,Packed,Agent-assigned
      if (fulfillment.type === "Delivery") {
        if (
          ffState === "Pending" ||
          ffState === "Agent-assigned" ||
          ffState === "Packed"
        ) {
         
          fulfillment.stops.forEach((stop) => {
            if (stop.type === "start") {
              if (stop?.time?.timestamp) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }

            if (stop.type === "end") {
              if (stop?.time?.timestamp) {
                onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }
          });
          if(invoice && !rfq) onStatusObj.invoiceErr=`/documents (Invoice) is not required before order is picked up for Non RFQ Flow.`
        }
        //Order-picked-up

        if (ffState === "Order-picked-up") {
         
          if (orderState !== "In-progress") {
            onStatusObj.ordrStatErr = `Order state should be 'In-progress' for fulfillment state - ${ffState}`;
          }
          fulfillment.stops.forEach((stop) => {
            if (stop.type === "start") {
              pickupTime = stop?.time?.timestamp;
              dao.setValue("pickupTime", pickupTime);
              if (!pickupTime) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is required for fulfillment state - ${ffState}`;
              }

              if (_.gt(pickupTime, contextTime)) {
                onStatusObj.tmstmpErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be future dated w.r.t context/timestamp for fulfillment state - ${ffState}`;
              }
            }

            if (stop.type === "end") {
              if (stop?.time?.timestamp) {
                onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }
          });
          if(!invoice) onStatusObj.invoiceErr=`/documents (Invoice) is required once the order is picked up`
        }

        //Out-for-delivery
        if (ffState === "Out-for-delivery") {
          
          if (orderState !== "In-progress") {
            onStatusObj.ordrStatErr = `Order state should be 'In-progress' for fulfillment state - ${ffState}`;
          }
          fulfillment.stops.forEach((stop) => {
            if (stop.type === "start") {
              pickupTime = stop?.time?.timestamp;

              if (!pickupTime) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is required for fulfillment state - ${ffState}`;
              } else if (
                dao.getValue("pickupTime") &&
                pickupTime !== dao.getValue("pickupTime")
              ) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
              }
            }

            if (stop.type === "end") {
              if (stop?.time?.timestamp) {
                onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }
          });
          if(!invoice) onStatusObj.invoiceErr=`/documents (Invoice) is required once the order is picked up`
        }

        //Order-delivered
        if (ffState === "Order-delivered") {
         
          if (orderState !== "Completed") {
            onStatusObj.ordrStatErr = `Order state should be 'Completed' for fulfillment state - ${ffState}`;
          }
          fulfillment.stops.forEach((stop) => {
            if (stop.type === "start") {
              pickupTime = stop?.time?.timestamp;
              if (!pickupTime) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is required for fulfillment state - ${ffState}`;
              } else if (
                dao.getValue("pickupTime") &&
                pickupTime !== dao.getValue("pickupTime")
              ) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot change for fulfillment state - ${ffState}`;
              }
            }

            if (stop.type === "end") {
              deliveryTime = stop?.time?.timestamp;
              dao.setValue("deliveryTime", deliveryTime);

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
          });
          if(!invoice) onStatusObj.invoiceErr=`/documents (Invoice) is required once the order is picked up`
        }
      }
      if (fulfillment.type === "Self-Pickup") {
        if (
          ffState === "Pending" ||
          ffState === "Packed"
        ) {
          fulfillment.stops.forEach((stop) => {
            if (stop.type === "start") {
              if (stop?.time?.timestamp) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }

            if (stop.type === "end") {
              if (stop?.time?.timestamp) {
                onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }
          });
        }

        if (ffState === "Order-picked-up") {
          if (orderState !== "Completed") {
            onStatusObj.ordrStatErr = `Order state should be 'Completed' once the order is picked up`;
          }
          fulfillment.stops.forEach((stop) => {
            if (stop.type === "start") {
              pickupTime = stop?.time?.timestamp;
              dao.setValue("pickupTime", pickupTime);
              if (!pickupTime) {
                onStatusObj.pickupTimeErr = `Pickup timestamp (fulfillments/start/time/timestamp) is required for fulfillment state - ${ffState}`;
              }

              if (_.gt(pickupTime, contextTime)) {
                onStatusObj.tmstmpErr = `Pickup timestamp (fulfillments/start/time/timestamp) cannot be future dated w.r.t context/timestamp for fulfillment state - ${ffState}`;
              }
            }

            if (stop.type === "end") {
              if (stop?.time?.timestamp) {
                onStatusObj.deliveryTimeErr = `Delivery timestamp (fulfillments/end/time/timestamp) cannot be provided for fulfillment state - ${ffState}`;
              }
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(`Error checking fulfillments/start in /on_status`);
  }
  console.log(onStatusObj);
  return onStatusObj;
};

module.exports = checkOnStatus;
