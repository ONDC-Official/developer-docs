const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const constants = require("../constants");
const { RET_ONUPDATE } = require("../constants");

const checkOnUpdate = (dirPath, msgIdSet) => {
  let onUpdtObj = {};

  try {
    let on_update = fs.readFileSync(
      dirPath + `/${constants.RET_ONUPDATE}.json`
    );
    on_update = JSON.parse(on_update);

    try {
      console.log(`Validating Schema for /${constants.RET_ONUPDATE} API`);
      const vs = validateSchema("retail", constants.RET_ONUPDATE, on_update);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(onUpdtObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_ONUPDATE}`,
        error
      );
    }

    try {
      console.log(`Checking context for /${constants.RET_ONUPDATE} API`); //checking context
      res = checkContext(on_update.context, constants.RET_ONUPDATE);
      if (!res.valid) {
        Object.assign(onUpdtObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONUPDATE} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONUPDATE}`
      );
      if (!_.isEqual(dao.getValue("city"), on_update.context.city)) {
        onUpdtObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONUPDATE}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONUPDATE}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}`
      );
      if (_.gte(dao.getValue("updtTmpstmp"), on_update.context.timestamp)) {
        onUpdtObj.tmpstmp = `Timestamp for /${constants.RET_UPDATE} api cannot be greater than or equal to /${constants.RET_ONUPDATE} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONUPDATE}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_update.context.transaction_id)) {
        onUpdtObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONUPDATE} API`,
        error
      );
    }

    try {
      console.log(
        `Comparing Message Ids of /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_update.context.message_id)) {
        onUpdtObj.msgId = `Message Ids for /${constants.RET_UPDATE} and /${constants.RET_ONUPDATE} apis should be same`;
      }
      // if (msgIdSet.has(confirm.context.message_id)) {
      //   cnfrmObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = confirm.context.message_id;
      msgIdSet.add(on_update.context.message_id);
    } catch (error) {
      console.log(
        `Error while checking message id for /${constants.RET_ONUPDATE}`,
        error
      );
    }

    on_update = on_update.message.order;

    try {
      console.log(
        `Comparing order ids in /${constants.RET_CONFIRM} and /${constants.RET_ONUPDATE}`
      );
      if (dao.getValue("cnfrmOrdrId") != on_update.id) {
        onUpdtObj.orderID = `Order Id mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONUPDATE}`;
      }
    } catch (error) {
      console.log(
        `!!Error while trying to fetch order ids in /${constants.RET_ONUPDATE}`,
        error
      );
    }

    try {
      console.log(`Checking items update status`);
      itemsUpdt = dao.getValue("itemsUpdt");
      for (item in itemsUpdt) {
        let updatedItem = on_update.items.find((it) => it.id === item);
        //Checking if item can be updated? (if update_type is return, fulfillment state should be Order-delivered and in case of cancel, fulfillment state should be cancelled)
        if (itemsUpdt[item][1] === "return") {
          let itemff = on_update.fulfillments.find(
            (ff) => ff.id === updatedItem.fulfillment_id
          );
          if (itemff.state.descriptor.code != "Order-delivered") {
            onUpdtObj.updtTypFF = `item with id: ${item} can't be returned when order is not delivered (fulfillment state should be Order-delivered)`;
          }
        } else if (itemsUpdt[item][1] === "cancel") {
          let itemff = on_update.fulfillments.find(
            (ff) => ff.id === updatedItem.fulfillment_id
          );
          if (
            itemff.state.descriptor.code != "Pending" ||
            itemff.state.descriptor.code != "Packed"
          ) {
            onUpdtObj.updtTypFF = `item with id: ${item} can't be cancelled when fulfillment state is not Pending/Packed`;
          }
        }
      }
    } catch (error) {
      console.log(
        `!!Error while checking items update status in /${constants.RET_ONUPDATE}`,
        error
      );
    }

    try {
      console.log(
        `Checking start/end time.timestamp in case of triggering fulfillment states`
      );
      on_update.fulfillments.forEach((ff) => {
        state = ff.state.descriptor.code;
        if (state === "Order-picked-up" || state === "Out-for-delivery") {
          if (!ff.start.time.timestamp) {
            onUpdtObj.ffstrttimetmpstmp = `fulfillment start timestamp is mandatory when fulfillment state is ${state}`;
          }
        } else if (state === "Order-delivered") {
          if (!ff.start.time.timestamp) {
            onUpdtObj.ffstrttimetmpstmp = `fulfillment start timestamp is mandatory when fulfillment state is ${state}`;
          }
          if (!ff.end.time.timestamp) {
            onUpdtObj.ffendtimetmpstmp = `fulfillment end timestamp is mandatory when fulfillment state is ${state}`;
          }
        }
      });
    } catch (error) {
      console.log(
        `Error while checking timestamp in case of triggering fulfillment states in /${RET_ONUPDATE}`,
        error
      );
    }

    try {
      console.log(`Quote Breakup ${constants.RET_ONUPDATE} all checks`);
      // let itemsIdList = dao.getValue("itemsIdList");
      // let itemsCtgrs = dao.getValue("itemsCtgrs");
      let itemFlfllmnts = dao.getValue("itemFlfllmnts");
      let onUpdatePrice = 0;

      on_update.quote.breakup.forEach((element, i) => {
        let titleType = element["@ondc/org/title_type"];
        // console.log(element.price.value);

        console.log(
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

          console.log(
            `Comparing individual item's total price and unit price `
          );
          if (!element.hasOwnProperty("item")) {
            onUpdtObj.priceBreakup = `Item's unit price missing in quote.breakup for item id ${element["@ondc/org/item_id"]}`;
          } else if (
            parseFloat(element.item.price.value) *
              element["@ondc/org/item_quantity"].count !=
            element.price.value
          ) {
            onUpdtObj.priceBreakup = `Item's unit and total price mismatch for id: ${element["@ondc/org/item_id"]}`;
          }

          console.log(
            `checking available and maximum count in ${constants.RET_ONUPDATE}`
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

        // console.log(`Calculating Items' prices in /${constants.RET_ONUPDATE}`);
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
            ] = `item with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in items[]`;
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
            ] = `${titleType} with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in fulfillments[]`;
          }
        }
      });

      dao.setValue("onUpdatePrice", onUpdatePrice);

      console.log(
        `Matching quoted Price ${parseFloat(
          on_update.quote.price.value
        )} with Breakup Price ${onUpdatePrice}`
      );
      if (onUpdatePrice != parseFloat(on_update.quote.price.value)) {
        onUpdtObj.quoteBrkup = `quote.price.value ${on_update.quote.price.value} does not match with the price breakup ${onUpdatePrice}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking and comparing the quoted price in /${constants.RET_ONUPDATE}`,
        error
      );
    }

    dao.setValue("onUpdtObj", onUpdtObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_ONUPDATE} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONUPDATE} API`,
        err
      );
    }
  }
};

module.exports = checkOnUpdate;
