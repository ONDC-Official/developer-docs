const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnSelect = async (data, msgIdSet) => {
  const onSelectObj = {};
  let onSelect = data;
  let error = onSelect.error
  let citycode = onSelect?.context?.location?.city?.code;
  onSelect = onSelect.message.order;
  let quote = onSelect?.quote;
  const items = onSelect.items;
  let fulfillments = onSelect?.fulfillments;
  let ffState, ffId;
  let deliveryQuoteItem = false;
  let deliveryCharge = 0;
  let outOfStock = false;
  dao.setValue("onSlctdItemsArray", items);
  const selectedItems = dao.getValue("slctdItemsArray");
  
  if(error && error.code ==='40002') outOfStock= true;
  try {
    console.log("Checking fulfillment object in /on_select");
    if (fulfillments) {
      fulfillments.forEach((fulfillment) => {
        let fulfillmentTags = fulfillment?.tags;
          
        if (citycode === "std:999" && !fulfillmentTags) {
          onSelectObj.fullfntTagErr = `Delivery terms (INCOTERMS) are required for exports in /fulfillments/tags`;
        }
        ffId = fulfillment?.id;
        ffState = fulfillment?.state?.descriptor?.code;
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    console.log("Comparing items object with /select");
    const itemDiff = utils.findDifferencesInArrays(items, selectedItems);
    console.log(itemDiff);

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
    console.log(`Checking quote object in /on_select api`);
   
    quote?.breakup.forEach((breakup, i) => {
      let itemPrice = parseFloat(breakup?.item?.price?.value);
      let available = Number(breakup?.item?.quantity?.available?.count);
      let quantity = breakup["@ondc/org/item_quantity"];


    
      if (
        breakup["@ondc/org/title_type"] === "delivery" &&
        breakup["@ondc/org/item_id"] === ffId
      ) {
        deliveryQuoteItem = true;
        deliveryCharge = breakup?.price?.value;
        console.log("deliverycharge", deliveryCharge);
      }
      if (
        breakup["@ondc/org/title_type"] === "item" &&
        quantity &&
        parseFloat(breakup.price.value).toFixed(2) !=
          parseFloat(itemPrice * quantity?.count).toFixed(2)
      ) {
        let item = `quoteErr${i}`;
        onSelectObj[
          item
        ] = `Total price of the item with item id ${breakup["@ondc/org/item_id"]} is not in sync with the unit price and quantity`;
      }

      if (
        breakup["@ondc/org/title_type"] === "item" &&
        quantity &&
        quantity?.count > available
      ) {
        let item = `quoteErr${i}`;
        onSelectObj[
          item
        ] = `@ondc/org/item_quantity for item with id ${breakup["@ondc/org/item_id"]} cannot be more than the available count (quantity/avaialble/count) in quote/breakup`;
      }
    });
  

    items.forEach(item=>{
      let itemId= item?.id
      let itemQuant = item?.quantity?.selected?.count

      quote?.breakup.forEach(breakup=>{

        if(breakup['@ondc/org/title_type']==='item' && breakup['@ondc/org/item_id']===itemId){
          if(itemQuant===breakup['@ondc/org/item_quantity'].count && outOfStock == true){
            onSelectObj.quoteItemQuantity=`In case of item quantity unavailable, item quantity in quote breakup should be updated to the available quantity`
          }
          if(itemQuant!==breakup['@ondc/org/item_quantity'].count && outOfStock == false){
            onSelectObj.quoteItemQuantity1=`Item quantity in quote breakup should be equal to the items/quantity/selected/count`
          }
          if(itemQuant>breakup['@ondc/org/item_quantity'].count && outOfStock==false){
            onSelectObj.outOfStockErr=`Error object with appropriate error code should be sent when the selected item quantity is not available`
          }
        }
      })
    })
    if (!deliveryQuoteItem && ffState === "Serviceable") {
      onSelectObj.deliveryQuoteErr = `Delivery charges should be provided in quote/breakup when fulfillment is 'Serviceable'`;
    }
    if (
      deliveryQuoteItem &&
      deliveryCharge != 0 &&
      ffState === "Non-serviceable"
    ) {
      onSelectObj.deliveryQuoteErr = `Delivery charges are not required or should be zero in quote/breakup when fulfillment is 'Non-serviceable'`;
    }

    if (ffState === "Non-serviceable" && !data.error) {
      onSelectObj.nonSrvcableErr = `Error object with appropriate error code should be sent in case fulfillment is 'Non-serviceable`;
    }
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /on_select api`,
      error
    );
  }

  return onSelectObj;
};
module.exports = checkOnSelect;
