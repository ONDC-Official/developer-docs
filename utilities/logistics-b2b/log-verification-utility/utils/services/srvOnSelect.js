const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnSelect = async (data, msgIdSet) => {
  const onSelectObj = {};
  let onSelect = data;
  onSelect = onSelect.message.order;
  let quote = onSelect?.quote;
  const items = onSelect.items;
  let fulfillments = onSelect?.fulfillments;
  let ffState, ffId;
  dao.setValue("onSlctdItemsArray", items);
  const selectedItems = dao.getValue("slctdItemsArray");
  try {
    console.log("Checking fulfillment object in /on_select");
    if (fulfillments) {
      fulfillments.forEach((fulfillment) => {
        ffId = fulfillment?.id;
        ffState = fulfillment?.state?.descriptor?.code;
      });
    }

    if (ffState === "Non-serviceable" && !data.error) {
      onSelectObj.nonSrvcableErr = `Error object with appropriate error code should be sent in case fulfillment is 'Non-serviceable`;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    console.log("Comparing items object with /select");
    const itemDiff = utils.findDifferencesInArrays(items, selectedItems);

    itemDiff.forEach((item, i) => {
      let index = item.attributes.indexOf("fulfillment_ids");
      if (index !== -1) {
        item.attributes.splice(index, 1);
      }
      if (item.attributes?.length > 0) {
        let itemkey = `item-${i}-DiffErr`;
        onSelectObj[
          itemkey
        ] = `In /items, '${item.attributes}' mismatch from /select for item with id ${item.index}`;
      }
    });
  } catch (error) {
    console.log(error);
  }

  try {
    console.log(
      "Comparing fulfillment_ids in /items and /fulfillments in /on_select"
    );
    items.forEach((item) => {
      let fulfillment_ids = item.fulfillment_ids;
      let fulfillmentSet = new Set();

      for (let fulfillment of fulfillments) {
        fulfillmentSet.add(fulfillment.id);
      }

      let missingIds = [];

      for (let id of fulfillment_ids) {
        if (!fulfillmentSet.has(id)) {
          missingIds.push(id);
        }
      }

      if (missingIds.length > 0) {
        onSelectObj.missingFlmntIds = `Fulfillment id/s ${missingIds} in /items does not exist in /fulfillments`;
      }
    });
  } catch (error) {
    console.log(error);
  }

  return onSelectObj;
};
module.exports = checkOnSelect;
