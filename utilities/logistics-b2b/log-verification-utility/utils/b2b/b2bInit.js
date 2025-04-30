const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkInit = (data, msgIdSet) => {
  const initObj = {};
  let init = data;
  let citycode = init?.context?.location?.city?.code;
  init = init.message.order;

  let items = init.items;
  let fulfillments = init.fulfillments;
  const selectedItems = dao.getValue("onSlctdItemsArray");

  try {
    console.log("Comparing items and fulfillments object with /on_select");
    fulfillments.forEach((fulfillment, i) => {
      let fulfillmentTags = fulfillment?.tags;

      if (citycode === "std:999" && !fulfillmentTags) {
        selectObj.fullfntTagErr = `Delivery terms (INCOTERMS) are required for exports in /fulfillments/tags`;
      }
    });

    const itemDiff = utils.findDifferencesInArrays(items, selectedItems);
    console.log(itemDiff);
    itemDiff.forEach((item, i) => {
      if (item?.attributes?.length > 0) {
        let itemkey = `item-${i}-DiffErr`;
        initObj[
          itemkey
        ] = `In /items, '${item.attributes}' mismatch from /on_select for item with id ${item.index}`;
      }
    });
  } catch (error) {
    console.log(error);
  }

  return initObj;
};

module.exports = checkInit;
