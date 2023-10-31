const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");
const {reverseGeoCodingCheck} = require("../reverseGeoCoding")

const checkOnSearch = (data, msgIdSet) => {
  const onSrchObj = {};
  let onSearch = data;
  let core_version = onSearch.context.core_version;
  let timestamp = onSearch.context.timestamp;
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
          const currentDate = timestamp.split('T')[0];
          const dateObj = new Date(currentDate);
          const nextDate = new Date(dateObj.setDate(dateObj.getDate() + 1)).toISOString().split('T')[0];
          const categoryTimestamp = core_version == "1.1.0" ? categoryTime?.timestamp?.split('T')[0] : categoryTime?.timestamp;
          if((catName == 'Same Day Delivery' || catName == 'Immediate Delivery') && categoryTimestamp && categoryTimestamp != currentDate){
            onSrchObj.catTAT = `For Same Day Delivery/Immediate Delivery, TAT date should be the same date i.e. ${currentDate}`
          }
          if(catName == 'Next Day Delivery' && categoryTimestamp && categoryTimestamp != nextDate){
            onSrchObj.catTAT = `For Next Day Delivery, TAT date should be the next date i.e. ${nextDate}`
          }
          provider.items.forEach((item) => {
            const catId = item.category_id;
            const itemTime = item.time;
            const itemTimestamp = core_version == "1.1.0" ? itemTime?.timestamp?.split('T')[0] : itemTime?.timestamp;
            if (catName === catId && !categoryTime && !itemTime)
              onSrchObj.TAT = `Either Category level TAT or Item level TAT should be given in ${constants.LOG_ONSEARCH} api for category "${catName}"`;
              if((catId == 'Same Day Delivery' || catId == 'Immediate Delivery') && itemTimestamp && itemTimestamp != currentDate){
                onSrchObj.itemTAT = `For Same Day Delivery/Immediate Delivery, TAT date should be the same date i.e. ${currentDate}`
              }
              if(catId == 'Next Day Delivery' && itemTimestamp && itemTimestamp != nextDate){
                onSrchObj.itemTAT = `For Next Day Delivery, TAT date should be the next date i.e. ${nextDate}`
              }  
          });
        });
      });
    }
  } catch (error) {
    console.log(
      `!!Error while fetching category and item TAT`,
      error
    );
  }


  //forward and backward shipment
  try {
    console.log(
      `Checking forward and backward shipment in ${constants.LOG_ONSEARCH} api`
    );

    if (
      onSearch["bpp/fulfillments"] ||
      onSearch["bpp/providers"][0].fulfillments
    ) {
      const fulfillments =
        core_version === "1.1.0"
          ? onSearch["bpp/fulfillments"]
          : onSearch["bpp/providers"][0].fulfillments;

      dao.setValue("bppFulfillmentsArr", fulfillments);

      let hasForwardShipment = false;
      let hasBackwardShipment = false;

      for (const fulfillment of fulfillments) {
        validFulfillmentIDs.add(fulfillment.id);
        if (fulfillment.type === "Prepaid" || fulfillment.type === "CoD" || fulfillment.type === "Delivery") {
          hasForwardShipment = true;
        } else if (
          fulfillment.type === "RTO" ||
          fulfillment.type === "Reverse QC" || fulfillment.type === "Return"
        ) {
          hasBackwardShipment = true;
        }
      }

      if (hasForwardShipment && hasBackwardShipment) {
        console.log(
          "Both forward and backward shipments are present."
        );
      } else if (!hasForwardShipment) {
        onSrchObj.frwrdShpmnt = `Forward shipment is missing in fulfillments in ${constants.LOG_ONSEARCH} api`;
      } else if (!hasBackwardShipment) {
        onSrchObj.bkwrdshmpnt = `Backward shipment is missing in fulfillments in ${constants.LOG_ONSEARCH} api`;
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
            onSrchObj.fulfillmentIDerr = `fulfillment_id - ${item.fulfillment_id} of /items/${j} does not match with any id in fulfillments array in ${constants.LOG_ONSEARCH} api`;
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

  // RGC checks on bpp/provider

  console.log(`Checking Reverse Geocoding on bpp/providers`);
  if (onSearch.hasOwnProperty("bpp/providers")) {
    onSearch["bpp/providers"].forEach((provider) => {
      if (provider.hasOwnProperty("locations")) {
        provider.locations.forEach(
          async ({ id, gps, address: { area_code } }) => {
            try {
              const [lat, long] = gps.split(",");
              const match = await reverseGeoCodingCheck(lat, long, area_code);
              if (!match)
                onSrchObj[
                  "bpp/provider:location:" + id + ":RGC"
                ] = `Reverse Geocoding for location ID ${id} failed. Area Code ${area_code} not matching with ${lat},${long} Lat-Long pair.`;
            } catch (error) {
              console.log("bpp/providers error: ", error);
            }
          }
        );
      }
    });
  }

  return onSrchObj;
};
module.exports = checkOnSearch;
