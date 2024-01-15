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
        let mandatoryAttr;
        let attrPresent = false;

        if (domain === "ONDC:RET12") {
          mandatoryAttr = constants.FASHION_ATTRIBUTES;
        }
        if (domain === "ONDC:RET14") {
          mandatoryAttr = constants.ELECTRONICS_ATTRIBUTES;
        }
        itemTags.map(({ descriptor, list }, index) => {
          switch (descriptor?.code) {
            case "attribute":
              attrPresent = true;
              const encounteredAttr = [];
              list.map(({ descriptor, value }) => {
                encounteredAttr.push(descriptor?.code);
              });

              // Check if all mandatory attributes are encountered
              const missingAttr = mandatoryAttr.filter(
                (code) => !encounteredAttr.includes(code)
              );
              if (missingAttr.length > 0) {
                onSrchObj.mssngAttrErr = `'${missingAttr}' attribute/s required in items/tags for ${domain} domain`;
              }
              break;
          }
        });

        if (
          (domain === "ONDC:RET12" || domain === "ONDC:RET14") &&
          !attrPresent
        )
          onSrchObj.attrErr = `code = 'attribute' is required in items/tags for domain - ${domain} and provider/id - ${provider.id}`;
      });
    }
  }

  return onSrchObj;
};
module.exports = checkOnSearch;
