const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnSearch = (data, msgIdSet) => {
  const onSrchObj = {};
  let onSearch = data;
  let search = dao.getValue("searchObj");
  let validFulfillmentIDs = new Set();
  onSearch = onSearch.message.catalog;

  try {
    console.log(
      `Checking TAT for category or item in ${constants.LOG_ONSEARCH} api`
    );
    if (onSearch.hasOwnProperty("bpp/providers")) {
      onSearch["bpp/providers"].forEach((provider) => {
        provider.categories.forEach((category) => {
          const catName = category.id;
          const categoryTime = category.time;
          provider.items.forEach((item) => {
            const catId = item.category_id;
            const itemTime = item.time;
            if (catName === catId && !categoryTime && !itemTime)
              onSrchObj.TAT = `Either Category level TAT or Item level TAT should be given in ${constants.LOG_ONSEARCH} api for category "${catName}"`;
          });
        });
      });
    }
  } catch (error) {
    console.log(`!!Error while fetching category and item TAT`, error);
  }

  //forward and backward shipment
  try {
    console.log(
      `Checking forward and backward shipment in ${constants.LOG_ONSEARCH} api`
    );

    if (onSearch["bpp/fulfillments"]) {
      const fulfillments = onSearch["bpp/fulfillments"];
      dao.setValue("bppFulfillmentsArr", fulfillments);

      let hasForwardShipment = false;
      let hasBackwardShipment = false;

      for (const fulfillment of fulfillments) {
        validFulfillmentIDs.add(fulfillment.id);
        if (fulfillment.type === "Prepaid" || fulfillment.type === "CoD") {
          hasForwardShipment = true;
        } else if (
          fulfillment.type === "RTO" ||
          fulfillment.type === "Reverse QC"
        ) {
          hasBackwardShipment = true;
        }
      }

      if (hasForwardShipment && hasBackwardShipment) {
        console.log("Both forward and backward shipments are present.");
      } else if (!hasForwardShipment) {
        onSrchObj.frwrdShpmnt = `Forward shipment (Prepaid or CoD) is missing in ${constants.LOG_ONSEARCH} api`;
      } else if (!hasBackwardShipment) {
        onSrchObj.bkwrdshmpnt = `Backward shipment (RTO or Reverse QC) is missing in ${constants.LOG_ONSEARCH} api`;
      }
    }
  } catch (error) {
    console.log(
      `!!Error while checking forward/backward shipment in ${constants.LOG_ONSEARCH} api`,
      error
    );
  }

  try {
    console.log(
      `Checking item fulfillment_id corresponding to one of the ids in bpp/fulfillments in ${constants.LOG_ONSEARCH} api`
    );
    if (onSearch["bpp/providers"]) {
      let providers = onSearch["bpp/providers"];
      dao.setValue("providersArr", providers);
      providers.forEach((provider, i) => {
        let itemsArr = provider.items;
        const providerId = provider.id;
    
        dao.setValue(`${providerId}itemsArr`, itemsArr);
        itemsArr.forEach((item, j) => {
          if (!validFulfillmentIDs.has(item.fulfillment_id)) {
            onSrchObj.fulfillmentIDerr = `fulfillment_id of /items/${j} for /bpp/provider/${i} does not match with the id in bpp/fulfillments in ${constants.LOG_ONSEARCH} api`;
          }
          if (
            item.descriptor.code === "P2H2P" &&
            !search["@ondc/org/payload_details"].dimensions
          ) {
            let itemKey = `dimensionErr${j}`;
            onSrchObj[
              itemKey
            ] = `@ondc/org/payload_details/dimensions is a required property in /search request for 'P2H2P' shipments`;
          }
        });
      });
    }
  } catch (error) {
    console.log(
      `!!Error while checking fulfillment ids in /items in ${constants.LOG_ONSEARCH} api`,
      error
    );
  }

  return onSrchObj;
};
module.exports = checkOnSearch;