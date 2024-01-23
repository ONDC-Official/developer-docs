const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkInit = (data, msgIdSet) => {
  const initObj = {};
  let init = data;
  init = init.message.order;

  let items = init.items;
  const selectedItems = dao.getValue("slctdItemsArray");

  try {
    console.log("Comparing items object with /select");
    const itemDiff = utils.findDifferencesInArrays(items, selectedItems);
    console.log(itemDiff);
    itemDiff.forEach((item, i) => {
      let itemkey = `item-${i}-DiffErr`;
      initObj[
        itemkey
      ] = `In /items, '${item.attributes}' mismatch from /select`;
    });
  } catch (error) {
    console.log(error);
  }

  return initObj;
};

module.exports = checkInit;
