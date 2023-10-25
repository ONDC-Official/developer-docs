const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");
const utils = require("../utils");

const checkOnInit = (data, msgIdSet) => {
  let on_init = data;
  const onInitObj = {};

  on_init = on_init.message.order;
  let provId = on_init.provider.id;

  let onSearchProvArr = dao.getValue("providersArr");

  try {
    console.log(
      `Comparing order quote price and break up  in ${constants.LOG_ONINIT}`
    );
    if (on_init.hasOwnProperty("quote")) {
      if (!utils.hasTwoOrLessDecimalPlaces(on_init.quote.price.value)) {
        onInitObj.qteDecimalErr = `Quote price value should not have more than 2 decimal places`;
      }
      let totalBreakup = 0;
      on_init.quote.breakup.forEach((breakup, i) => {
        if (!utils.hasTwoOrLessDecimalPlaces(breakup.price.value)) {
          let itemkey = `itemPriceErr${i}`;

          onInitObj[
            itemkey
          ] = `Price value for '${breakup["@ondc/org/title_type"]}' should not have more than 2 decimal places`;
        }
        totalBreakup += parseFloat(breakup.price.value);
        
        onSearchProvArr?.forEach((provider) => {
         
          if (provider.id === provId) {
            provider?.items.forEach((item, i) => {
            
              if (
                item.id === breakup["@ondc/org/item_id"] &&
                (breakup["@ondc/org/title_type"] === "delivery")
              ) {
                if (parseFloat(on_init.quote.price.value) !== parseFloat(item.price.value)) {
                  let itemKey = `priceArr${i}`;
                  onInitObj[
                    itemKey
                  ] = `Quote price ${parseFloat(on_init.quote.price.value)} for item id '${breakup["@ondc/org/item_id"]}' does not match item price ${item.price.value} in /on_search`;
                }
              }
             
            });
           
           
          }
        });
      });

      if (parseFloat(on_init.quote.price.value) !== totalBreakup)
        onInitObj.quotePriceErr = `Quote price ${parseFloat(on_init.quote.price.value)} does not match the breakup total  ${totalBreakup} in ${constants.LOG_ONINIT}`;
    }
  } catch (err) {
    console.log(
      `!!Error fetching order quote price in ${constants.LOG_ONINIT}`,
      err
    );
  }

  return onInitObj;
};

module.exports = checkOnInit;
