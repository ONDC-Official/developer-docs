const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnSelect = async (data, msgIdSet) => {
  const onSelectObj = {};
  let onSelect = data;
  onSelect = onSelect.message.order;
  let quote = onSelect?.quote;
  let fulfillments = onSelect?.fulfillments;
  let ffState, ffId;
  let deliveryQuoteItem = false;
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

  try {
    console.log(`Checking quote object in /on_select api`);
    quote?.breakup.forEach((breakup) => {
      let itemPrice = parseFloat(breakup?.item?.price?.value);
      let quantity = breakup["@ondc/org/item_quantity"];

      if (
        breakup["@ondc/org/title_type"] === "delivery" &&
        breakup["@ondc/org/item_id"] === ffId
      ) {
        deliveryQuoteItem = true;
      }
      if (
        breakup["@ondc/org/title_type"] === "item" &&
        quantity &&
        parseFloat(breakup.price.value) != itemPrice * quantity?.count
      ) {
        onSelectObj.quoteErr = `Total price of the item with item id ${breakup["@ondc/org/item_id"]} is not in sync with the unit price and quantity`;
      }
    });

    if (!deliveryQuoteItem && ffState === "Serviceable") {
      onSelectObj.deliveryQuoteErr = `Delivery charges should be provided in quote/breakup when fulfillment is 'Serviceable'`;
    }
    if (deliveryQuoteItem && ffState === "Non-serviceable") {
      onSelectObj.deliveryQuoteErr = `Delivery charges are not required in quote/breakup when fulfillment is 'Non-serviceable'`;
    }

    if (ffState === "Non-serviceable" && !data.error) {
      onSelectObj.nonSrvcableErr = `Error object with appropriate error code should be sent in case fulfillment is 'Non-serviceable`;
    }
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /on_search api`,
      error
    );
  }

  return onSelectObj;
};
module.exports = checkOnSelect;
