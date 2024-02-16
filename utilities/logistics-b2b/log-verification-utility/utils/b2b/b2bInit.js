const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkInit = (data, msgIdSet) => {
  const initObj = {};
  let init = data;
  init = init.message.order;

  let items = init.items;
<<<<<<< HEAD
  const selectedItems = dao.getValue("slctdItemsArray");
=======
  const selectedItems = dao.getValue("onSlctdItemsArray");
>>>>>>> patch-reference-implementations-remote/main

  try {
    console.log("Comparing items object with /select");
    const itemDiff = utils.findDifferencesInArrays(items, selectedItems);
    console.log(itemDiff);
    itemDiff.forEach((item, i) => {
      if(item?.attributes?.length>0){
      let itemkey = `item-${i}-DiffErr`;
      initObj[
        itemkey
      ] = `In /items, '${item.attributes}' mismatch from /select`;
    }
    });
  } catch (error) {
    console.log(error);
  }

  return initObj;
};

module.exports = checkInit;
