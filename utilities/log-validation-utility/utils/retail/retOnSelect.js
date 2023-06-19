const fs = require("fs");
const _ = require("lodash");
const { checkContext } = require("../../services/service");
const dao = require("../../dao/dao");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");
const logger = require("../logger");

const checkOnSelect = (dirPath, msgIdSet) => {
  let onSlctObj = {};
  try {
    on_select = fs.readFileSync(dirPath + `/${constants.RET_ONSELECT}.json`);

    on_select = JSON.parse(on_select);

    try {
      logger.info(`Checking context for /${constants.RET_ONSELECT} API`); //checking context
      res = checkContext(on_select.context, constants.RET_ONSELECT);
      if (!res.valid) {
        Object.assign(onSlctObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONSELECT} context, ${error.stack}`
      );
    }
    try {
      logger.info(`Validating Schema for /${constants.RET_ONSELECT} API`);
      const vs = validateSchema("retail", constants.RET_ONSELECT, on_select);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(onSlctObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONSELECT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_select.context.city)) {
        onSlctObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONSELECT}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_SELECT} and /${constants.RET_ONSELECT}`
      );
      const tmpstmp = dao.getValue("tmpstmp");
      if (_.gte(tmpstmp, on_select.context.timestamp)) {
        onSlctObj.tmpstmp = `Timestamp for /${constants.RET_SELECT} api cannot be greater than or equal to /${constants.RET_ONSELECT} api`;
      } else {
        const timeDiff = utils.timeDiff(on_select.context.timestamp, tmpstmp);
        logger.info(timeDiff);
        if (timeDiff > 5000) {
          onSlctObj.tmpstmp = `context/timestamp difference between /${constants.RET_ONSELECT} and /${constants.RET_SELECT} should be smaller than 5 sec`;
        }
      }
      dao.setValue("tmpstmp", on_select.context.timestamp);
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_SELECT} and /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONSELECT}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_select.context.transaction_id)) {
        onSlctObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONSELECT} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing Message Ids of /${constants.RET_SELECT} and /${constants.RET_ONSELECT}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_select.context.message_id)) {
        onSlctObj.msgId = `Message Id for /${constants.RET_SELECT} and /${constants.RET_ONSELECT} api should be same`;
      }

      if (msgIdSet.has(on_select.context.message_id)) {
        onSlctObj.msgId2 =
          "Message Id cannot be same for different sets of APIs";
      }
      // msgId = select.context.message_id;
      msgIdSet.add(on_select.context.message_id);
    } catch (error) {
      logger.info(
        `Error while comparing message ids for /${constants.RET_SELECT} and /${constants.RET_ONSELECT} api, ${error.stack}`
      );
    }

    let on_select_error = {};
    try {
      logger.info(`Checking domain-error in /${constants.RET_ONSELECT}`);
      if (on_select.hasOwnProperty("error")) {
        on_select_error = on_select.error;
      }
    } catch (error) {
      logger.info(
        `Error while checking domain-error in /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    on_select = on_select.message.order;
    let itemFlfllmnts = {};

    try {
      logger.info(
        `Checking provider id in /${constants.RET_ONSEARCH} and /${constants.RET_ONSELECT}`
      );
      if (dao.getValue("providerId") != on_select.provider.id) {
        onSlctObj.prvdrId = `provider.id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONSELECT}`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing provider ids in /${constants.RET_ONSEARCH} and /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      logger.info(`Item Id and Fulfillment Id Mapping in /on_select`);
      let i = 0;
      const len = on_select.items.length;
      while (i < len) {
        const found = on_select.fulfillments.some(
          (fId) => fId.id === on_select.items[i].fulfillment_id
        );
        if (!found) {
          const key = `fId${i}`;
          onSlctObj[
            key
          ] = `fulfillment_id for item ${on_select.items[i].id} does not exist in order.fulfillments[]`;
        }
        i++;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking Item Id and Fulfillment Id Mapping in /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      logger.info("Mapping and storing item Id and fulfillment Id");
      let i = 0;
      const len = on_select.items.length;
      while (i < len) {
        let id = on_select.items[i].id;
        itemFlfllmnts[id] = on_select.items[i].fulfillment_id;
        i++;
      }
      dao.setValue("itemFlfllmnts", itemFlfllmnts);
    } catch (error) {
      logger.error(
        `!!Error occurred while mapping and storing item Id and fulfillment Id, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking TAT and TTS in /${constants.RET_ONSELECT}`);
      const tts = dao.getValue("timeToShip");
      on_select.fulfillments.forEach((ff, indx) => {
        const tat = utils.isoDurToSec(ff["@ondc/org/TAT"]);

        if (tat < tts) {
          onSlctObj.ttstat = `/fulfillments[${indx}]/@ondc/org/TAT (O2D) in /${constants.RET_ONSELECT} can't be smaller than @ondc/org/time_ship (O2S) in /${constants.RET_ONSEARCH}`;
        }
        if (tat === tts) {
          onSlctObj.ttstat = `/fulfillments[${indx}]/@ondc/org/TAT (O2D) in /${constants.RET_ONSELECT} can't be equal to @ondc/org/time_ship (O2S) in /${constants.RET_ONSEARCH}`;
        }

        logger.info(tat, "asdfasdf", tts);
      });
    } catch (error) {
      logger.error(
        `!!Error while checking TAT and TTS in /${constants.RET_ONSELECT}`
      );
    }

    let nonServiceableFlag = 0;
    try {
      logger.info(`Checking fulfillments' state in ${constants.RET_ONSELECT}`);
      const ffState = on_select.fulfillments.every((ff) => {
        const ffDesc = ff.state.descriptor;
        if (ffDesc.code === "Non-serviceable") {
          nonServiceableFlag = 1;
        }
        return ffDesc.hasOwnProperty("code")
          ? ffDesc.code === "Serviceable" || ffDesc.code === "Non-serviceable"
          : false;
      });

      if (!ffState)
        onSlctObj.ffStateCode = `Pre-order fulfillment state codes should be used in fulfillments[].state.descriptor.code`;
      else if (
        nonServiceableFlag &&
        (!on_select_error ||
          !on_select_error.type === "DOMAIN-ERROR" ||
          !on_select_error.code === "30009")
      ) {
        onSlctObj.notServiceable = `Non Serviceable Domain error should be provided when fulfillment is not serviceable`;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking fulfillments' state in /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    let onSelectPrice = 0; //Net price after discounts and tax in /on_select
    let onSelectItemsPrice = 0; //Price of only items in /on_select

    try {
      logger.info(
        `Comparing count of items in ${constants.RET_SELECT} and ${constants.RET_ONSELECT}`
      );
      let itemsIdList = dao.getValue("itemsIdList");
      logger.info(itemsIdList);
      on_select.quote.breakup.forEach((item) => {
        if (
          item["@ondc/org/item_id"] in itemsIdList &&
          item["@ondc/org/title_type"] === "item"
        ) {
          if (
            itemsIdList[item["@ondc/org/item_id"]] !=
              item["@ondc/org/item_quantity"].count &&
            (!on_select_error ||
              on_select_error.type != "DOMAIN-ERROR" ||
              on_select_error.code != "40002")
          ) {
            let cntkey = `cnt${item["@ondc/org/item_id"]}`;
            onSlctObj[
              cntkey
            ] = `Count of item with id: ${item["@ondc/org/item_id"]} does not match in ${constants.RET_SELECT} & ${constants.RET_ONSELECT} (suitable domain error should be provided)`;
          }
        } else if (
          item["@ondc/org/title_type"] === "item" &&
          !(item["@ondc/org/item_id"] in itemsIdList)
        ) {
          onSlctObj.itmBrkup = `item with id: ${item["@ondc/org/item_id"]} is not present in /${constants.RET_ONSEARCH}`;
        }
      });
    } catch (error) {
      // onSlctObj.countErr = `Count of item does not match with the count in /select`;
      logger.error(
        `!!Error while comparing count items in ${constants.RET_SELECT} and ${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `-x-x-x-x-Quote Breakup ${constants.RET_ONSELECT} all checks-x-x-x-x`
      );
      let itemsIdList = dao.getValue("itemsIdList");
      let itemsCtgrs = dao.getValue("itemsCtgrs");
      on_select.quote.breakup.forEach((element, i) => {
        let titleType = element["@ondc/org/title_type"];
        // logger.info(element.price.value);

        logger.info(
          `Calculating quoted Price Breakup for element ${element.title}`
        );
        onSelectPrice += parseFloat(element.price.value);

        if (titleType === "item") {
          if (!(element["@ondc/org/item_id"] in itemFlfllmnts)) {
            let brkupitemid = `brkupitemid${i}`;
            onSlctObj[
              brkupitemid
            ] = `item with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in items[]`;
          }

          logger.info(
            `Comparing individual item's total price and unit price `
          );
          if (!element.hasOwnProperty("item")) {
            onSlctObj.priceBreakup = `Item's unit price missing in quote.breakup for item id ${element["@ondc/org/item_id"]}`;
          } else if (
            parseFloat(element.item.price.value) *
              element["@ondc/org/item_quantity"].count !=
            element.price.value
          ) {
            onSlctObj.priceBreakup = `Item's unit and total price mismatch for id: ${element["@ondc/org/item_id"]}`;
          }

          logger.info(
            `checking available and maximum count in ${constants.RET_ONSELECT}`
          );

          if (element.item.hasOwnProperty("quantity")) {
            if (
              _.gt(
                parseFloat(element.item.quantity.available.count),
                parseFloat(element.item.quantity.maximum.count)
              )
            ) {
              let key = `qntcnt${i}`;
              onSlctObj[
                key
              ] = `available count can't be greater than maximum count for item id: ${element["@ondc/org/item_id"]}`;
            }
          }
        }

        logger.info(`Calculating Items' prices in /${constants.RET_ONSELECT}`);
        if (element["@ondc/org/item_id"] in itemsIdList) {
          if (
            titleType === "item" ||
            (titleType === "tax" &&
              !utils.taxNotInlcusive.includes(
                itemsCtgrs[element["@ondc/org/item_id"]]
              ))
          )
            onSelectItemsPrice += parseFloat(element.price.value);
        }

        if (titleType === "tax" || titleType === "discount") {
          if (!(element["@ondc/org/item_id"] in itemFlfllmnts)) {
            let brkupitemsid = `brkupitemstitles${i}`;
            onSlctObj[
              brkupitemsid
            ] = `item with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in items[] (should be a valid item id)`;
          }
        }
        if (["tax", "discount", "packing", "misc"].includes(titleType)) {
          if (parseFloat(element.price.value) == 0) {
            let key = `breakupItem${titleType}`;
            onSlctObj[
              key
            ] = `${titleType} line item should not be present if price=0`;
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
            onSlctObj[
              brkupffid
            ] = `invalid  id: ${element["@ondc/org/item_id"]} in ${titleType} line item (should be a valid fulfillment_id)`;
          }
        }
      });

      dao.setValue("onSelectPrice", on_select.quote.price.value);

      logger.info(
        `Matching quoted Price ${parseFloat(
          on_select.quote.price.value
        )} with Breakup Price ${onSelectPrice}`
      );
      if (onSelectPrice != parseFloat(on_select.quote.price.value)) {
        onSlctObj.quoteBrkup = `quote.price.value ${on_select.quote.price.value} does not match with the price breakup ${onSelectPrice}`;
      }
      let selectedPrice = dao.getValue("selectedPrice");
      logger.info(
        `Matching price breakup of items ${onSelectItemsPrice} (/${constants.RET_ONSELECT}) with selected items price ${selectedPrice} (${constants.RET_SELECT})`
      );

      if (onSelectItemsPrice != selectedPrice) {
        onSlctObj.priceErr = `Warning: Quoted Price in /${constants.RET_ONSELECT} INR ${onSelectItemsPrice} does not match with the total price of items in /${constants.RET_SELECT} INR ${selectedPrice}`;
        logger.info("Quoted Price and Selected Items price mismatch");
      }
    } catch (error) {
      logger.error(
        `!!Error while checking and comparing the quoted price in /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      // checking if delivery line item present in case of Serviceable
      const quoteBreakup = on_select.quote.breakup;
      const deliveryItems = quoteBreakup.filter(
        (item) => item["@ondc/org/title_type"] === "delivery"
      );
      const noOfDeliveries = deliveryItems.length;
      if (!noOfDeliveries && !nonServiceableFlag) {
        onSlctObj.deliveryLineItem = `delivery line item must be present in quote/breakup (if location is serviceable)`;
      }
    } catch (error) {
      logger.info(
        `!!Error occurred while checking delivery line item in /${constants.RET_ONSELECT}`
      );
    }

    try {
      logger.info(
        `Checking payment breakup title & type in /${constants.RET_ONSELECT}`
      );
      on_select.quote.breakup.forEach((item) => {
        if (
          item["@ondc/org/title_type"] != "item" &&
          !Object.values(utils.retailPymntTtl).includes(
            item["@ondc/org/title_type"]
          )
        ) {
          onSlctObj.pymntttltyp = `Quote breakup Payment title type "${item["@ondc/org/title_type"]}" is not as per the API contract`;
        }

        if (
          item["@ondc/org/title_type"] != "item" &&
          !(item.title.toLowerCase().trim() in utils.retailPymntTtl)
        ) {
          onSlctObj.pymntttl = `Quote breakup Payment title "${item.title}" is not as per the API Contract`;
        } else if (
          item["@ondc/org/title_type"] != "item" &&
          utils.retailPymntTtl[item.title.toLowerCase().trim()] !=
            item["@ondc/org/title_type"]
        ) {
          onSlctObj.pymntttlmap = `Quote breakup Payment title "${
            item.title
          }" comes under the title type "${
            utils.retailPymntTtl[item.title.toLowerCase().trim()]
          }"`;
        }
      });
    } catch (error) {
      logger.error(
        `!!Error while checking payment breakup title & type in /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    try {
      //matching fulfillments TAT
      logger.info("Checking Fulfillment TAT...");
      on_select.fulfillments.forEach((ff) => {
        if (!ff["@ondc/org/TAT"]) {
          logger.info(
            `Fulfillment TAT must be present for Fulfillment ID: ${ff.id}`
          );
          onSlctObj.ffTAT = `Fulfillment TAT must be present for fulfillment ID: ${ff.id}`;
        }
      });
    } catch (error) {
      logger.info(
        `Error while checking fulfillments TAT in /${constants.RET_ONSELECT}`
      );
    }

    try {
      logger.info("Checking quote validity quote.ttl");
      if (!on_select.quote.hasOwnProperty("ttl")) {
        onSlctObj.qtTtl = "quote.ttl: Validity of the quote is missing";
      }
    } catch (error) {
      logger.error(
        `!!Error while checking quote.ttl in /${constants.RET_ONSELECT}`
      );
    }

    try {
      logger.info(`Storing Quote object in /${constants.RET_ONSELECT}`);
      on_select.quote.breakup.forEach((element) => {
        if (element["@ondc/org/title_type"] === "item") {
          if (element.hasOwnProperty("item")) {
            delete element.item.quantity;
          }
        }
      });
      //saving on select quote
      dao.setValue("quoteObj", on_select.quote);
    } catch (error) {
      logger.error(
        `!!Error while storing quote object in /${constants.RET_ONSELECT}, ${error.stack}`
      );
    }

    // dao.setValue("onSlctObj", onSlctObj);
    logger.info(onSlctObj);
    return onSlctObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_ONSELECT} API`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONSELECT} API, ${error.stack}`
      );
    }
  }
};

module.exports = checkOnSelect;
