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

      try {
        console.log("Checking provider serviceability");

        let providerTags = provider?.tags;
        if (providerTags) {
          providerTags.forEach((tag) => {
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
        } else {
          onSrchObj.servcbltyErr =
            "serviceability tag is required for a provider in providers/tags";
        }
      } catch (error) {
        console.log(error);
      }

      try {
        console.log("Checking item tags");
        let items = provider?.items;
        items.forEach((item) => {
          let itemTags = item?.tags;
          if (itemTags) {
            itemTags.forEach((tag) => {
              if (tag?.descriptor?.code === "reschedule_terms" && tag?.list) {
                mandatoryTags = constants.RESCHEDULE_TERMS;
                let missingTags = utils.findMissingTags(
                  tag?.list,
                  "reschedule_terms",
                  mandatoryTags
                );
                if (missingTags.length > 0) {
                  onSrchObj.mssngRescdlTagErr = `'${missingTags}' code/s required in providers/tags for ${tag?.descriptor?.code}`;
                }
              }
            });
          } else {
            onSrchObj.reschdlTrmErr = `reschedule_terms tag is required for an item in items/tags`;
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return onSrchObj;
};
module.exports = checkOnSearch;
