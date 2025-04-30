const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const constants = require("../constants");
const logger = require("../logger");
//updatedQuotePrice
//refundTriggering (state:time)
//quotePrice
const checkOnUpdate = (msgIdSet, on_update, state) => {
  let onUpdtObj = {};

  try {
    logger.info(
      `Validating Schema for /${constants.RET_ONUPDATE}_${state} API`
    );
    const vs = validateSchema("retail", constants.RET_ONUPDATE, on_update);
    if (vs != "error") {
      // logger.info(vs);
      Object.assign(onUpdtObj, vs);
    }
  } catch (error) {
    logger.error(
      `!!Error occurred while performing schema validation for /${constants.RET_ONUPDATE}_${state}`,
      error
    );
  }

  try {
    logger.info(`Checking context for /${constants.RET_ONUPDATE}_${state} API`); //checking context
    res = checkContext(on_update.context, constants.RET_ONUPDATE);
    if (!res.valid) {
      Object.assign(onUpdtObj, res.ERRORS);
    }
  } catch (error) {
    logger.error(
      `!!Some error occurred while checking /${constants.RET_ONUPDATE}_${state} context`,
      error
    );
  }

  try {
    logger.info(
      `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONUPDATE}_${state}`
    );
    if (!_.isEqual(dao.getValue("city"), on_update.context.city)) {
      onUpdtObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONUPDATE}_${state}`;
    }
  } catch (error) {
    logger.info(
      `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONUPDATE}_${state}`,
      error
    );
  }

  try {
    logger.info(
      `Comparing timestamp of /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}_${state}`
    );
    if (_.gte(dao.getValue("updtTmpstmp"), on_update.context.timestamp)) {
      onUpdtObj.tmpstmp = `Timestamp for /${constants.RET_UPDATE} api cannot be greater than or equal to /${constants.RET_ONUPDATE}_${state} api`;
    }
  } catch (error) {
    logger.info(
      `Error while comparing timestamp for /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}_${state} api`,
      error
    );
  }

  try {
    logger.info(
      `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONUPDATE}_${state}`
    );
    if (!_.isEqual(dao.getValue("txnId"), on_update.context.transaction_id)) {
      onUpdtObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
    }
  } catch (error) {
    logger.error(
      `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONUPDATE}_${state} API`,
      error
    );
  }

  try {
    logger.info(
      `Comparing Message Ids of /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}_${state}`
    );
    if (!_.isEqual(dao.getValue("msgId"), on_update.context.message_id)) {
      onUpdtObj.msgId = `message_id of all unsolicited /on_update calls should be same for a particular /update request`;
    }
  } catch (error) {
    logger.info(
      `Error while checking message id for /${constants.RET_ONUPDATE}_${state}`,
      error
    );
  }
  const contextTime = on_update.context.timestamp;
  on_update = on_update.message.order;

  try {
    logger.info(
      `Comparing order ids in /${constants.RET_CONFIRM} and /${constants.RET_ONUPDATE}_${state}`
    );
    if (!_.isEqual(dao.getValue("cnfrmOrdrId"), on_update.id)) {
      onUpdtObj.orderID = `Order Id mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONUPDATE}_${state}`;
    }
  } catch (error) {
    logger.error(
      `!!Error while trying to fetch order ids in /${constants.RET_ONUPDATE}_${state}`,
      error
    );
  }

  try {
    let i = 0;
    //checking count of returned item in //onupdate_picked

    const quoteBreakup = on_update.quote.breakup;
    const returnedItemsCount = dao.getValue("itemsUpdt");
    const itemsActualCount = dao.getValue("itemsIdList");

    for (itemId in returnedItemsCount) {
      let remainingCount = _.subtract(
        itemsActualCount[itemId],
        returnedItemsCount[itemId]
      );

      let quoteItem = quoteBreakup.filter(
        (itm) =>
          itm["@ondc/org/item_id"] === itemId &&
          itm["@ondc/org/title_type"] === "item"
      );

      const noOfQuoteItems = quoteItem.length;
      //There should be only one object present for that returned item in quote/breakup
      if (noOfQuoteItems > 1) {
        let key = `quoteItemErr${itemId}`;
        onUpdtObj[
          key
        ] = `Invalid quote/breakup item: ${itemId} can't have multiple objects`;
      } else {
        //In below states quote is not updated

        try {
          if (
            ["Return_Initiated", "Return_Approved", "Return_Rejected"].includes(
              state
            )
          ) {
            //item should not be removed from the quote
            if (!noOfQuoteItems) {
              let key = `quoteItemUpdt${itemId}`;
              onUpdtObj[
                key
              ] = `returned item: ${itemId} should not be removed from quote when return state is ${state}`;
            } else if (
              //count of returned item should not change
              !_.isEqual(
                quoteItem[0]["@ondc/org/item_quantity"]["count"],
                itemsActualCount[itemId]
              )
            ) {
              let key = `quoteItemUpdt${itemId}`;
              onUpdtObj[
                key
              ] = `item quantity should not change in quote/breakup for item: ${itemId} when state is ${state}`;
            }
          }
        } catch (error) {
          logger.error(
            `Error while checking quote/breakup in ${constants.RET_ONUPDATE}_${state}, ${error.stack}`
          );
        }

        //For below states,the quote is updated

        try {
          if (
            ["Return_Picked", "Return_Delivered", "Liquidated"].includes(state)
          ) {
            //count of returned item should not change
            if (
              noOfQuoteItems &&
              !_.isEqual(
                quoteItem[0]["@ondc/org/item_quantity"]["count"],
                remainingCount
              )
            ) {
              let key = `quoteItemUpdt${itemId}`;
              onUpdtObj[
                key
              ] = `item quantity should be updated in quote/breakup for item: ${itemId} when state is ${state}`;
            }

            dao.setValue("updatedQuotePrice", on_update.quote.price.value);
          }
        } catch (error) {
          logger.error(
            `Error while checking quote/breakup in ${constants.RET_ONUPDATE}_${state}, ${error.stack}`
          );
        }

        try {
          if (_.isEqual(state, "Liquidated")) {
            if (!noOfQuoteItems) {
              onUpdtObj.quoteLineItem = `liquidated item must be present in quote/breakup with count=${remainingCount}`;
            }
          }
        } catch (error) {
          logger.error(
            `Error while checking quote/breakup in ${constants.RET_ONUPDATE}_${state}, ${error.stack}`
          );
        }
      }
    }
  } catch (error) {
    logger.error(
      `!!Error while checking count of returned item in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
    );
  }

  try {
    logger.info(`checking quote price in ${constants.RET_ONUPDATE}_${state}`);
    const quoteNotUpdates = [
      "Return_Initiated",
      "Return_Rejected",
      "Return_Approved",
      "Cancelled",
    ].includes(state);

    const quoteUpdates = [
      "Return_Picked",
      "Return_Delivered",
      "Liquidated",
    ].includes(state);

    const quotePrice = parseFloat(dao.getValue("quotePrice"));
    if (
      quoteNotUpdates &&
      quotePrice &&
      !_.isEqual(quotePrice, parseFloat(on_update.quote.price.value))
    ) {
      onUpdtObj.quoteNotUpdateState = `quote price should not change for return state ${state}`;
    } else if (
      quoteUpdates &&
      quotePrice &&
      _.isEqual(quotePrice, on_update.quote.price.value)
    ) {
      onUpdtObj.quoteUpdateState = `quote price should be updated for return state ${state}`;
    }
  } catch (error) {
    logger.error(
      `!!Error while checking quote price in ${constants.RET_ONUPDATE}_${state}, ${error.stack}`
    );
  }

  const checkReturnItem = (
    returnedItem,
    item,
    itemsUpdt,
    itemFulfillmentId
  ) => {
    if (!_.isEqual(returnedItem.tags.status, state)) {
      let key = `returnedItem${item}state`;
      onUpdtObj[
        key
      ] = `return state should be ${state} in /items/tags/status for item: ${item}`;
    }

    if (!_.isEqual(returnedItem.quantity.count, itemsUpdt[item])) {
      let key = `returnedItemCount${item}`;
      onUpdtObj[
        key
      ] = `quantity of returned item: ${item} mismatches in /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}`;
      // }
    }

    if (
      [
        "Return_Initiated",
        "Return_Rejected",
        "Liquidated",
        "Cancelled",
      ].includes(state)
    ) {
      if (!_.isEqual(returnedItem.fulfillment_id, itemFulfillmentId)) {
        onUpdtObj.ffStateCreation = `new fulfillment id should not be created for item: ${item} when return state is ${state}`;
      }
    } else if (
      ["Return_Approved", "Return_Picked", "Return_Delivered"].includes(state)
    ) {
      if (_.isEqual(returnedItem.fulfillment_id, itemFulfillmentId)) {
        onUpdtObj.ffStateCreation = `new fulfillment id should be created for item: ${item} when return state is ${state}`;
      }
    }
  };

  const checkReturnTags = (obj) => {
    const has = Object.prototype.hasOwnProperty;
    if (!has.call(obj, "tags")) {
      const key = `tags${obj.id}`;
      onUpdtObj[
        key
      ] = `return state must be present in /items/tags for item: ${obj.id}`;

      return 0;
    } else return 1;
  };

  try {
    logger.info(`Checking items update status`);
    const itemsUpdt = dao.getValue("itemsUpdt");
    const itemFlfllmnts = dao.getValue("itemFlfllmnts");
    const itemsIdList = dao.getValue("itemsIdList");
    //verifying the returned items
    for (item in itemsUpdt) {
      let updatedItem = on_update.items.filter((it) => it.id === item);
      totalItemsBreakup = updatedItem.length;

      const itemFulfillmentId = itemFlfllmnts[item];
      //checking if tags (return status) is present for returned item
      // let returnedItem = updatedItem.filter((item) =>
      //   item.hasOwnProperty("tags")
      // );
      // if (!returnedItem.length) {
      //   onUpdtObj.updatedItem = `return state must be present in /items/tags for item: ${item}`;
      // }

      // console.log("TESTING", returnedItem);

      //either all the purchased quantity is returned (totalItemsBreakup=1) or part returned (totalItemsBreakup>1)
      if (!totalItemsBreakup) {
        onUpdtObj.updatedItemNotPresent = `item for which return was initiated is not present in /items`;
      } else if (totalItemsBreakup === 1) {
        if (checkReturnTags(updatedItem[0])) {
          checkReturnItem(updatedItem[0], item, itemsUpdt, itemFulfillmentId);
        }
      } else if (totalItemsBreakup > 1) {
        let i = 0;
        let isTags = false;
        let noOfItemsBreakup = updatedItem.length;
        let totalItemCount = 0;
        while (i < noOfItemsBreakup) {
          let itemBreakup = updatedItem[i];
          totalItemCount += parseInt(itemBreakup.quantity.count);

          const has = Object.prototype.hasOwnProperty;

          if (has.call(itemBreakup, "tags")) {
            isTags = true;
            checkReturnItem(itemBreakup, item, itemsUpdt, itemFulfillmentId);
          } else if (
            !_.isEqual(itemBreakup.fulfillment_id, itemFulfillmentId)
          ) {
            onUpdtObj.nonReturnedItem = `fulfillment_id should not change for item: ${item} which is not returned`;
          }

          i++;
        }
        if (!isTags) {
          const key = `tags${item}`;
          onUpdtObj[
            key
          ] = `return state must be present in /items/tags for item: ${item}`;
        }

        //checking fulfillment id for returned item in various states

        if (totalItemCount != itemsIdList[item]) {
          onUpdtObj.itemCntErr = `Invalid quantity of items present in /order/items (returned & non-returned) for item: ${item}`;
        }
      }

      //Checking if item can be updated? (if update_type is return, fulfillment state should be Order-delivered )

      let itemff = on_update.fulfillments.find(
        (ff) => ff.id === itemFulfillmentId && ff.type === "Delivery"
      );

      if (
        itemff &&
        itemff.type === "Delivery" &&
        itemff.state.descriptor.code != "Order-delivered"
      ) {
        onUpdtObj.updtTypFF = `item with id: ${item} can't be returned when order is not delivered (fulfillment state should be Order-delivered)`;
      }

      // else if (itemsUpdt[item][1] === "cancel") {
      //   let itemff = on_update.fulfillments.find(
      //     (ff) => ff.id === updatedItem.fulfillment_id
      //   );
      //   if (
      //     itemff.state.descriptor.code != "Pending" ||
      //     itemff.state.descriptor.code != "Packed"
      //   ) {
      //     onUpdtObj.updtTypFF = `item with id: ${item} can't be cancelled when fulfillment state is not Pending/Packed`;
      //   }
      // }
    }
  } catch (error) {
    logger.error(
      `!!Error while checking items update status in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
    );
  }

  try {
    //checking fulfillment states as per the return state

    const reverseQCFulfillment = on_update.fulfillments.filter(
      (fulfillment) => {
        return fulfillment.type === "Reverse QC";
      }
    );
    const noOfReverseQC = reverseQCFulfillment.length;
    if (
      [
        "Return_Initiated",
        "Return_Rejected",
        "Liquidated",
        "Cancelled",
      ].includes(state) &&
      noOfReverseQC
    ) {
      onUpdtObj.reverseQcFulfillment = `Reverse QC fulfillment should not be created for return state ${state}`;
    } else if (
      ["Return_Approved", "Return_Picked", "Return_Delivered"].includes(
        state
      ) &&
      !noOfReverseQC
    ) {
      onUpdtObj.reverseQcFulfillment = `Reverse QC fulfillment should be created for return state ${state}`;
    }
  } catch (error) {
    logger.error(
      `!!Error while checking reverse QC fulfillment in /${constants.RET_ONUPDATE}_${state}`
    );
  }

  try {
    const pickupTimestamps = dao.getValue("pickupTimestamps");
    const deliveryTimestamps = dao.getValue("deliveryTimestamps");
    const deliveryFulfillment = on_update.fulfillments.filter((fulfillment) => {
      return fulfillment.type === "Delivery";
    });

    const noOfDeliveries = deliveryFulfillment.length;
    let i = 0;
    while (i < noOfDeliveries) {
      let fulfillment = deliveryFulfillment[i];

      const pickupTime = fulfillment.start.time.timestamp;
      const deliveryTime = fulfillment.end.time.timestamp;
      //checking if pickup and delivery timestamps are same as in /on_status delivered
      if (!_.isEqual(pickupTime, pickupTimestamps[fulfillment.id])) {
        let key = `pickupTime${i}`;
        onUpdtObj[
          key
        ] = `pickup timestamp (/start/time/timestamp) can't change for fulfillment id ${fulfillment.id}`;
      }
      if (!_.isEqual(deliveryTime, deliveryTimestamps[fulfillment.id])) {
        let key = `deliveryTime${i}`;
        onUpdtObj[
          key
        ] = `delivery timestamp (/end/time/timestamp) can't change for fulfillment id ${fulfillment.id}`;
      }

      i++;
    }
  } catch (error) {
    logger.error(
      `Error while checking pickup and delivery timestamp in ${constants.RET_ONUPDATE}_${state}, ${error.stack}`
    );
  }

  try {
    logger.info(
      `Checking order/updated_at timestamp in /${constants.RET_ONUPDATE}_${state}`
    );

    if (!_.gte(contextTime, on_update.updated_at)) {
      onUpdtObj.updatedAtTmpstmp = `order/updated_at timestamp can't be future dated (should match context/timestamp)`;
    }
  } catch (error) {
    logger.error(
      `!! Error while checking order/updated_at timestamp in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
    );
  }

  try {
    //checking order timestamps in /on_status
    if (!_.isEqual(on_update.created_at, dao.getValue("ordrCrtd"))) {
      onUpdtObj.crtdTmstmp = `order/created_at timestamp can't change (should remain same as in /${constants.RET_CONFIRM})`;
    }

    if (_.gte(on_update.created_at, on_update.updated_at)) {
      onUpdtObj.ordrTmstmp = `order created_at timestamp must always be earlier than the updated_at timestamp`;
    }
  } catch (error) {
    logger.error(
      `!!Error while checking order timestamps in /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
    );
  }

  try {
    logger.info(`Quote Breakup ${constants.RET_ONUPDATE}_${state} all checks`);
    // let itemsIdList = dao.getValue("itemsIdList");
    // let itemsCtgrs = dao.getValue("itemsCtgrs");
    let itemFlfllmnts = dao.getValue("itemFlfllmnts");
    let onUpdatePrice = 0;

    on_update.quote.breakup.forEach((element, i) => {
      let titleType = element["@ondc/org/title_type"];
      // logger.info(element.price.value);

      logger.info(
        `Calculating quoted Price Breakup for element ${element.title}`
      );
      onUpdatePrice += parseFloat(element.price.value);
      if (titleType === "item") {
        if (!(element["@ondc/org/item_id"] in itemFlfllmnts)) {
          let brkupitemid = `brkupitemid${i}`;
          onUpdtObj[
            brkupitemid
          ] = `item with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in items[]`;
        }

        logger.info(`Comparing individual item's total price and unit price `);
        if (!element.hasOwnProperty("item")) {
          onUpdtObj.priceBreakup = `Item's unit price missing in quote.breakup for item id ${element["@ondc/org/item_id"]}`;
        } else if (
          parseFloat(element.item.price.value) *
            element["@ondc/org/item_quantity"].count !=
          element.price.value
        ) {
          onUpdtObj.priceBreakup = `Item's unit and total price mismatch for id: ${element["@ondc/org/item_id"]}`;
        }

        logger.info(
          `checking available and maximum count in ${constants.RET_ONUPDATE}_${state}`
        );

        if (element.item.hasOwnProperty("quantity")) {
          if (
            _.gt(
              element.item.quantity.available.count,
              element.item.quantity.maximum.count
            )
          ) {
            onUpdtObj.qntCnt = `available count can't be greater than maximum count for item id: ${element["@ondc/org/item_id"]}`;
          }
        }
      }

      // logger.info(`Calculating Items' prices in /${constants.RET_ONUPDATE}_${state}`);
      // if (element["@ondc/org/item_id"] in itemsIdList) {
      //   if (
      //     titleType === "item" ||
      //     (titleType === "tax" &&
      //       !utils.taxNotInlcusive.includes(
      //         itemsCtgrs[element["@ondc/org/item_id"]]
      //       ))
      //   )
      //     onUpdateItemsPrice += parseFloat(element.price.value);
      // }

      if (titleType === "tax" || titleType === "discount") {
        if (!(element["@ondc/org/item_id"] in itemFlfllmnts)) {
          let brkupitemsid = `brkupitemstitles${i}`;
          onUpdtObj[
            brkupitemsid
          ] = `item with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in items[] (should be valid item id)`;
        }
      }

      if (
        titleType === "packing" ||
        titleType === "delivery" ||
        titleType === "misc"
      ) {
        if (
          !Object.values(itemFlfllmnts).includes(element["@ondc/org/item_id"])
        ) {
          let brkupffid = `brkupfftitles${i}`;
          onUpdtObj[
            brkupffid
          ] = `invalid  id: ${element["@ondc/org/item_id"]} in ${titleType} line item (should be a valid fulfillment_id)`;
        }
      }
    });

    dao.setValue("onUpdatePrice", onUpdatePrice);

    logger.info(
      `Matching quoted Price ${parseFloat(
        on_update.quote.price.value
      )} with Breakup Price ${onUpdatePrice}`
    );
    if (onUpdatePrice != parseFloat(on_update.quote.price.value)) {
      onUpdtObj.quoteBrkup = `quote.price.value ${on_update.quote.price.value} does not match with the price breakup ${onUpdatePrice}`;
    }
  } catch (error) {
    logger.error(
      `!!Error while checking and comparing the quoted price in /${constants.RET_ONUPDATE}_${state}`,
      error
    );
  }

  // dao.setValue("onUpdtObj", onUpdtObj);
  return onUpdtObj;
};

module.exports = checkOnUpdate;
