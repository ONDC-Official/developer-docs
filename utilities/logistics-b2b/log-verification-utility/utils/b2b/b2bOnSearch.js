const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");
const { reverseGeoCodingCheck } = require("../reverseGeoCoding");

const checkOnSearch = async (data, msgIdSet) => {
  const onSrchObj = {};
  let onSearch = data;
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

  dao.setValue("fulfillmentsArr", fulfillments);

  try {
    console.log(`Saving provider items array in /on_search api`);
    if (onSearch["providers"]) {
      let providers = onSearch["providers"];
      dao.setValue("providersArr", providers);
      providers.forEach((provider, i) => {
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

      //checking mandatory attributes for fashion and electronics

      provider.items.forEach((item) => {
        let itemTags = item?.tags;
        let mandatoryAttr = [];
        let attrPresent = false;
        let missingAttr = [];

        itemTags.forEach((tag) => {
          let { descriptor, list } = tag;
          if (descriptor?.code === "attribute" && constants.ATTR_DOMAINS.includes(domain)) {

            if (domain === "ONDC:RET12") {
              mandatoryAttr = constants.FASHION_ATTRIBUTES;
            }
            if (domain === "ONDC:RET14") {
              mandatoryAttr = constants.ELECTRONICS_ATTRIBUTES;
            }
            if (domain === "ONDC:RET12") {
              mandatoryAttr = constants.FASHION_ATTRIBUTES;
            }
            if (domain === "ONDC:RET1A"||domain === "ONDC:RET1B"||domain === "ONDC:RET1C"||domain === "ONDC:RET1D") {
              mandatoryAttr = constants.MANDATORY_ATTRIBUTES;
            }
            attrPresent = true;
            missingAttr = utils.findMissingTags(
              list,
              descriptor.code,
              mandatoryAttr
            );

            if (missingAttr.length > 0) {
              onSrchObj.mssngAttrErr = `'${missingAttr}' attribute/s required in items/tags for ${domain} domain`;
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
              onSrchObj.missingTagErr = `'${missingAttr}' required for 'g2' tag in items/tags`;
            }
          }
        });
        if (constants.ATTR_DOMAINS.includes(domain) && !attrPresent) {
          onSrchObj.attrMissing = `code = 'attribute' is missing in /items/tags for domain ${domain}`;
        }
      });
     
    }
  }

  return onSrchObj;
};
module.exports = checkOnSearch;
