const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");
const { reverseGeoCodingCheck } = require("../reverseGeoCoding");

const checkOnSearch = async (data, msgIdSet) => {
  const onSrchObj = {};
  let onSearch = data;
  let citycode = onSearch?.context?.location?.city?.code;
  let domain = onSearch.context.domain;
  onSearch = onSearch.message.catalog;

  //saving fulfillments
  try {
    console.log("checking attr");
    console.log(constants.ATTR_DOMAINS.includes(domain));
  } catch (error) {
    console.log(error);
  }
  const fulfillments = onSearch?.fulfillments;
  const payments = onSearch?.payments;

  dao.setValue("fulfillmentsArr", fulfillments);

  try {
    console.log(`Saving provider items array in /on_search api`);
    if (onSearch["providers"]) {
      let providers = onSearch["providers"];

      dao.setValue("providersArr", providers);
      providers.forEach((provider, i) => {
    
        console.log(citycode, provider?.creds);
        if (citycode === "std:999" && !provider.creds) {
          onSrchObj.msngCreds = `Creds are required for exports in /providers`;
        }
        let itemsArr = provider.items;
        const providerId = provider.id;

        dao.setValue(`${providerId}itemsArr`, itemsArr);
      });
    }
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /on_search api`,
      error
    );
  }

  if (onSearch.hasOwnProperty("providers")) {
    const providers = onSearch["providers"];
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      if (provider.hasOwnProperty("locations")) {
        const locations = provider.locations;
        for (let j = 0; j < locations.length; j++) {
          const { id, gps, area_code } = locations[j];
          try {
            const [lat, long] = gps.split(",");
            const match = await reverseGeoCodingCheck(lat, long, area_code);
            if (!match) {
              onSrchObj[
                "bpp/provider:location:" + id + ":RGC"
              ] = `Reverse Geocoding for location ID ${id} failed for provider with id '${provider?.id}'. Area Code ${area_code} not matching with ${lat},${long} Lat-Long pair.`;
            }
          } catch (error) {
            console.log("bpp/providers error: ", error);
          }
        }
      }

      try {
        console.log("Checking provider serviceability");

        let providerTags = provider?.tags;
        let providerTagSet = new Set();
        if (providerTags) {
          providerTags.forEach((tag, j) => {
            if (providerTagSet.has(tag?.descriptor?.code)) {
              let itemKey = `duplicatePrvdrTag${j}`;
              onSrchObj[
                itemKey
              ] = `${descriptor?.code} is a duplicate tag in /providers/tags`;
            } else {
              providerTagSet.add(tag?.descriptor?.code);
            }

            if (tag?.descriptor?.code === "serviceability" && tag?.list) {
              mandatoryTags = constants.SERVICEABILITY;
              let missingTags = utils.findMissingTags(
                tag?.list,
                "serviceability",
                mandatoryTags
              );
              if (missingTags.length > 0) {
                onSrchObj.mssngTagErr = `'${missingTags}' code/s required in providers/tags for serviceability`;
              }
            }
          });
        }

        let missingTags = [];

        for (let tag of constants.ON_SEARCH_PROVIDERTAGS) {
          if (!providerTagSet.has(tag)) {
            missingTags.push(tag);
          }
        }

        if (missingTags.length > 0) {
          let itemKey = `missingPRVDRTags-${i}-err`
          onSrchObj[itemKey] = `${missingTags} are required in /providers/tags`;
        }

        if (domain === "ONDC:RET10" || domain === "ONDC:RET11") {
          if (!providerTagSet.has("FSSAI_LICENSE_NO")) {
            onSrchObj.fssaiErr = `For food businesses, FSSAI_LICENSE_NO is required in providers/tags`;
          }
        }
      } catch (error) {
        console.log(error);
      }

      //checking mandatory attributes for fashion and electronics
      let locations = provider.locations;
      provider.items.forEach((item,k) => {
        let payment_ids = item.payment_ids;
        let fulfillment_ids = item.fulfillment_ids;
        let location_ids= item.location_ids
        let itemTags = item?.tags;
        let mandatoryAttr = [];
        let attrPresent = false;
        let missingAttr = [];

        try {
          console.log(
            "Comparing fulfillment_ids in /items and /fulfillments in /on_search"
          );

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
            let itemKey = `missingFlmntIds-${k}-err`
            onSrchObj[itemKey] = `Fulfillment id/s ${missingIds} in /items does not exist in /fulfillments`;
          }
        } catch (error) {
          console.log(error);
        }

        try {
          console.log(
            "Comparing location_ids in /items and /providers/locations in /on_search"
          );

        
          let locationSet = new Set();

          for (let loc of locations) {
            locationSet.add(loc?.id);
          }

          let missingIds = [];

          for (let id of location_ids) {
            if (!locationSet.has(id)) {
              missingIds.push(id);
            }
          }

          if (missingIds.length > 0) {
            let itemKey = `missingLoc-${k}-err`
            onSrchObj[itemKey] = `Location id/s ${missingIds} in /items does not exist in /providers/locations`;
          }
        } catch (error) {
          console.log(error);
        }
        try {
          console.log(
            "Comparing payment_ids in /items and /payments in /on_search"
          );

          let paymentSet = new Set();

          for (let payment of payments) {
            paymentSet.add(payment.id);
          }

          let missingIds = [];

          for (let id of payment_ids) {
            if (!paymentSet.has(id)) {
              missingIds.push(id);
            }
          }

          if (missingIds.length > 0) {
            let itemKey = `missingpymntIds-${k}-err`
            onSrchObj[itemKey] = `Payment id/s ${missingIds} in /items does not exist in /payments`;
          }
        } catch (error) {
          console.log(error);
        }
        let itemTagsSet = new Set();
        itemTags.forEach((tag, i) => {
          let { descriptor, list } = tag;

          if (
            itemTagsSet.has(descriptor?.code) &&
            descriptor?.code !== "price_slab"
          ) {
            let itemKey = `duplicateTag${k}`;
            onSrchObj[
              itemKey
            ] = `${descriptor?.code} is a duplicate tag in /items/tags`;
          } else {
            itemTagsSet.add(descriptor?.code);
          }

          if (
            descriptor?.code === "attribute" &&
            constants.ATTR_DOMAINS.includes(domain)
          ) {
            if (domain === "ONDC:RET12") {
              mandatoryAttr = constants.FASHION_ATTRIBUTES;
            }
            if (domain === "ONDC:RET14") {
              mandatoryAttr = constants.ELECTRONICS_ATTRIBUTES;
            }
            if (domain === "ONDC:RET12") {
              mandatoryAttr = constants.FASHION_ATTRIBUTES;
            }
            if (
              domain === "ONDC:RET1A" ||
              domain === "ONDC:RET1B" ||
              domain === "ONDC:RET1C" ||
              domain === "ONDC:RET1D"
            ) {
              mandatoryAttr = constants.MANDATORY_ATTRIBUTES;
            }
            attrPresent = true;
            missingAttr = utils.findMissingTags(
              list,
              descriptor.code,
              mandatoryAttr
            );

            if (missingAttr.length > 0) {
              let itemKey = `mssngAttrErr-${k}-err`
              onSrchObj[itemKey] = `'${missingAttr}' attribute/s required in items/tags for ${domain} domain`;
            }
          }
          if (descriptor?.code === "g2") {
            mandatoryAttr = constants.G2TAGS;
            missingAttr = utils.findMissingTags(
              list,
              descriptor.code,
              mandatoryAttr
            );

            if (missingAttr.length > 0) {
              let itemKey = `missingTagErr-${k}-err`
              onSrchObj[itemKey] = `'${missingAttr}' required for 'g2' tag in items/tags`;
            }
          }
          if (descriptor?.code === "origin") {
            list.forEach((tag) => {
              if (tag.descriptor.code === "country") {
                const alpha3Pattern = /^[A-Z]{3}$/;
                console.log("origin", alpha3Pattern.test(tag?.value));
                if (!alpha3Pattern.test(tag?.value)) {
                  onSrchObj.originFrmtErr = `Country of origin should be in a valid 'ISO 3166-1 alpha-3' format e.g. IND, SGP`;
                } else {
                  if (!constants.VALIDCOUNTRYCODES.includes(tag?.value)) {
                    let itemKey = `originFrmtErr1-${k}-err`
                    onSrchObj[itemKey] = `'${tag?.value}' is not a valid 'ISO 3166-1 alpha-3' country code`;
                  }
                }
              }
            });
          }
        });

        let missingTags = [];

        for (let tag of constants.ON_SEEARCH_ITEMTAGS) {
          if (!itemTagsSet.has(tag)) {
            missingTags.push(tag);
          }
        }

        if (missingTags.length > 0) {
          let itemKey = `missingItemTags-${k}-err`
          onSrchObj[itemKey] = `'${missingTags}' tag/s  required in /items/tags`;
        }
        if (constants.ATTR_DOMAINS.includes(domain) && !attrPresent) {
          let itemKey = `attrMissing-${k}-err`
          onSrchObj[itemKey] = `code = 'attribute' is missing in /items/tags for domain ${domain}`;
        }
      });
    }
  }

  return onSrchObj;
};
module.exports = checkOnSearch;
