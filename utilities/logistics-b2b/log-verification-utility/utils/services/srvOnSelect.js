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
  let deliveryQuoteItem = false;
  let deliveryCharge = 0
  dao.setValue("onSlctdItemsArray", items)
  const selectedItems = dao.getValue("slctdItemsArray");
  try {
    console.log("Checking fulfillment object in /on_select");
    if (fulfillments) {
      fulfillments.forEach((fulfillment) => {
        ffId = fulfillment?.id;
        ffState = fulfillment?.state?.descriptor?.code;
      });
    }
  } catch (error) {
    console.log(error);
  }

//   try {
//     console.log("Comparing items object with /select");
//     const itemDiff = utils.findDifferencesInArrays(items, selectedItems);
//     console.log(itemDiff);
//     itemDiff.forEach((item, i) => {
//       if(item?.attributes?.length>0){
//       let itemkey = `item-${i}-DiffErr`;
//       onSelectObj[
//         itemkey
//       ] = `In /items, '${item.attributes}' mismatch from /select`;
//     }
//     });
//   } catch (error) {
//     console.log(error);
//   }


//   try {
//     console.log(`Checking quote object in /on_select api`);
//     quote?.breakup.forEach((breakup, i) => {
//       let itemPrice = parseFloat(breakup?.item?.price?.value);
//       let available = Number(breakup?.item?.quantity?.available?.count);
//       let quantity = breakup["@ondc/org/item_quantity"];

//       if (
//         breakup["@ondc/org/title_type"] === "delivery" &&
//         breakup["@ondc/org/item_id"] === ffId
//       ) {
//         deliveryQuoteItem = true;
//         deliveryCharge= breakup?.price?.value
//         console.log("deliverycharge",deliveryCharge);
//       }
//       if (
//         breakup["@ondc/org/title_type"] === "item" &&
//         quantity &&
//         parseFloat(breakup.price.value).toFixed(2) !=
//           parseFloat(itemPrice * quantity?.count).toFixed(2)
//       ) {
//         let item = `quoteErr${i}`;
//         onSelectObj[
//           item
//         ] = `Total price of the item with item id ${breakup["@ondc/org/item_id"]} is not in sync with the unit price and quantity`;
//       }

//       if (
//         breakup["@ondc/org/title_type"] === "item" &&
//         quantity &&
//         quantity?.count > available
//       ) {
//         let item = `quoteErr${i}`;
//         onSelectObj[
//           item
//         ] = `@ondc/org/item_quantity for item with id ${breakup["@ondc/org/item_id"]} cannot be more than the available count (quantity/avaialble/count) in quote/breakup`;
//       }
//     });

//     if (ffState === "Non-serviceable" && !data.error) {
//       onSelectObj.nonSrvcableErr = `Error object with appropriate error code should be sent in case fulfillment is 'Non-serviceable`;
//     }
//   } catch (error) {
//     console.log(
//       `!!Error while checking providers array in /on_select api`,
//       error
//     );
//   }

  return onSelectObj;
};
module.exports = checkOnSelect;
