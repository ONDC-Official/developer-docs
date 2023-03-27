const fs = require("fs");
const _ = require("lodash");
const { checkContext } = require("../../services/service");
const dao = require("../../dao/dao");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnSelect = (dirPath, msgIdSet) => {
  let onSlctObj = {};
  try {
    on_select = fs.readFileSync(dirPath + `/${constants.RET_ONSELECT}.json`);

    on_select = JSON.parse(on_select);

    try {
      console.log(`Checking context for /${constants.RET_ONSELECT} API`); //checking context
      res = checkContext(on_select.context, constants.RET_ONSELECT);
      if (!res.valid) {
        Object.assign(onSlctObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONSELECT} context`,
        error
      );
    }
    try {
      console.log(`Validating Schema for /${constants.RET_ONSELECT} API`);
      const vs = validateSchema("retail", constants.RET_ONSELECT, on_select);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(onSlctObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONSELECT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_select.context.city)) {
        onSlctObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONSELECT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_SELECT} and /${constants.RET_ONSELECT}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_select.context.timestamp)) {
        onSlctObj.tmpstmp = `Timestamp for /${constants.RET_SELECT} api cannot be greater than or equal to /${constants.RET_ONSELECT} api`;
      }
      dao.setValue("tmpstmp", on_select.context.timestamp);
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.RET_SELECT} and /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONSELECT}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_select.context.transaction_id)) {
        onSlctObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONSELECT} api`,
        error
      );
    }

    try {
      console.log(
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
      console.log(
        `Error while comparing message ids for /${constants.RET_SELECT} and /${constants.RET_ONSELECT} api`,
        error
      );
    }

    let on_select_error = {};
    try {
      console.log(`Checking domain-error in /${constants.RET_ONSELECT}`);
      if (on_select.hasOwnProperty("error")) {
        on_select_error = on_select.error;
      }
    } catch (error) {
      console.log(
        `Error while checking domain-error in /${constants.RET_ONSELECT}`,
        error
      );
    }

    on_select = on_select.message.order;
    let itemFlfllmnts = {};

    try {
      console.log(
        `Checking provider id in /${constants.RET_ONSEARCH} and /${constants.RET_ONSELECT}`
      );
      if (dao.getValue("providerId") != on_select.provider.id) {
        onSlctObj.prvdrId = `provider.id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONSELECT}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing provider ids in /${constants.RET_ONSEARCH} and /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log(`Item Id and Fulfillment Id Mapping in /on_select`);
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
      console.log(
        `!!Error while checking Item Id and Fulfillment Id Mapping in /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log("Mapping and storing item Id and fulfillment Id");
      let i = 0;
      const len = on_select.items.length;
      while (i < len) {
        let id = on_select.items[i].id;
        itemFlfllmnts[id] = on_select.items[i].fulfillment_id;
        i++;
      }
      dao.setValue("itemFlfllmnts", itemFlfllmnts);
    } catch (error) {
      console.log(
        "!!Error occurred while mapping and storing item Id and fulfillment Id",
        error
      );
    }

    try {
      console.log(`Checking fulfillments' state in ${constants.RET_ONSELECT}`);
      let nonServiceableFlag = 0;
      const ffState = on_select.fulfillments.every((ff) => {
        const ffDesc = ff.state.descriptor;
        if (ffDesc.code.toLowerCase() === "non-serviceable") {
          nonServiceableFlag = 1;
        }
        return ffDesc.hasOwnProperty("code")
          ? ffDesc.code.toLowerCase() === "serviceable" ||
              ffDesc.code.toLowerCase() === "non-serviceable"
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
      console.log(
        `!!Error while checking fulfillments' state in /${constants.RET_ONSELECT}`,
        error
      );
    }

    let onSelectPrice = 0; //Net price after discounts and tax in /on_select
    let onSelectItemsPrice = 0; //Price of only items in /on_select

    try {
      console.log(
        `Comparing count of items in ${constants.RET_SELECT} and ${constants.RET_ONSELECT}`
      );
      let itemsIdList = dao.getValue("itemsIdList");
      console.log(itemsIdList);
      on_select.quote.breakup.forEach((item) => {
        if (
          item["@ondc/org/item_id"] in itemsIdList &&
          item["@ondc/org/title_type"] === "item"
        ) {
          if (
            itemsIdList[item["@ondc/org/item_id"]] ===
              item["@ondc/org/item_quantity"].count ||
            (itemsIdList[item["@ondc/org/item_id"]] >
              item["@ondc/org/item_quantity"].count &&
              on_select_error &&
              on_select_error.type === "DOMAIN-ERROR" &&
              on_select_error.code === "400002")
          ) {
            console.log(
              `count of item with id: ${item["@ondc/org/item_id"]} is as per the API contract`
            );
          } else {
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
      console.log(
        `!!Error while comparing count items in ${constants.RET_SELECT} and ${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log(
        `-x-x-x-x-Quote Breakup ${constants.RET_ONSELECT} all checks-x-x-x-x`
      );
      let itemsIdList = dao.getValue("itemsIdList");
      let itemsCtgrs = dao.getValue("itemsCtgrs");
      on_select.quote.breakup.forEach((element, i) => {
        let titleType = element["@ondc/org/title_type"];
        // console.log(element.price.value);

        console.log(
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

          console.log(
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

          console.log(
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

        console.log(`Calculating Items' prices in /${constants.RET_ONSELECT}`);
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
            onSlctObj[
              brkupffid
            ] = `${titleType} with id: ${element["@ondc/org/item_id"]} in quote.breakup[${i}] does not exist in fulfillments[]`;
          }
        }
      });

      dao.setValue("onSelectPrice", on_select.quote.price.value);

      console.log(
        `Matching quoted Price ${parseFloat(
          on_select.quote.price.value
        )} with Breakup Price ${onSelectPrice}`
      );
      if (onSelectPrice != parseFloat(on_select.quote.price.value)) {
        onSlctObj.quoteBrkup = `quote.price.value ${on_select.quote.price.value} does not match with the price breakup ${onSelectPrice}`;
      }
      let selectedPrice = dao.getValue("selectedPrice");
      console.log(
        `Matching price breakup of items ${onSelectItemsPrice} (/${constants.RET_ONSELECT}) with selected items price ${selectedPrice} (${constants.RET_SELECT})`
      );

      if (onSelectItemsPrice != selectedPrice) {
        onSlctObj.priceErr = `Warning: Quoted Price in /${constants.RET_ONSELECT} INR ${onSelectItemsPrice} does not match with the total price of items in /${constants.RET_SELECT} INR ${selectedPrice}`;
        console.log("Quoted Price and Selected Items price mismatch");
      }
    } catch (error) {
      console.log(
        `!!Error while checking and comparing the quoted price in /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      console.log(
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
      console.log(
        `!!Error while checking payment breakup title & type in /${constants.RET_ONSELECT}`,
        error
      );
    }

    try {
      //matching fulfillments TAT
      console.log("Checking Fulfillment TAT...");
      on_select.fulfillments.forEach((ff) => {
        if (!ff["@ondc/org/TAT"]) {
          console.log(
            `Fulfillment TAT must be present for Fulfillment ID: ${ff.id}`
          );
          onSlctObj.ffTAT = `Fulfillment TAT must be present for fulfillment ID: ${ff.id}`;
        }
      });
    } catch (error) {
      console.log(
        `Error while checking fulfillments TAT in /${constants.RET_ONSELECT}`
      );
    }

    try {
      console.log("Checking quote validity quote.ttl");
      if (!on_select.quote.hasOwnProperty("ttl")) {
        onSlctObj.qtTtl = "quote.ttl: Validity of the quote is missing";
      }
    } catch (error) {
      console.log(
        `!!Error while checking quote.ttl in /${constants.RET_ONSELECT}`
      );
    }

    try {
      console.log(`Storing Quote object in /${constants.RET_ONSELECT}`);
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
      console.log(
        `!!Error while storing quote object in /${constants.RET_ONSELECT}`,
        error
      );
    }

    dao.setValue("onSlctObj", onSlctObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_ONSELECT} API`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONSELECT} API`,
        error
      );
    }
  }
};

module.exports = checkOnSelect;
