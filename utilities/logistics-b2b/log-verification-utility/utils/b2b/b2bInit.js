const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkInit = (data, msgIdSet) => {
  const initObj = {};
  let init = data;
  init = init.message.order;

  let itemsArr = init.items;
  let fulfillmentsArr = init.fulfillments;
  let onSearchitemsArr;
  let providersArr = dao.getValue("providersArr");

  //provider check
  try {
    console.log(`Comparing provider object in /init and /on_search`);
    if (init.provider) {
      onSearchitemsArr = dao.getValue(`${init.provider.id}itemsArr`);
      let providerObj = providersArr?.filter(
        (prov) => prov.id === init.provider.id
      );
      if (providerObj?.length < 1) {
        initObj.prvdrErr = `Provider with id '${init.provider.id}' does not exist in the catalog provided in /on_search`;
      } else {
        if (
          (!init?.provider?.locations ||
            init?.provider?.locations?.length < 1) &&
          providerObj[0]?.locations?.length > 1
        ) {
          initObj.provLocErr = `Provider location is mandatory if provided in the catalog in /on_search`;
        } else if (init?.provider?.locations) {
          let providerLocArr = init.provider.locations;
          let providerLocExists = false;
          providerLocArr.forEach((location, i) => {
            providerObj[0]?.locations?.forEach((element) => {
              console.log(location.id, element.id);

              if (location.id === element.id) providerLocExists = true;
            });
            if (!providerLocExists) {
              let itemkey = `providerLocErr${i}`;
              initObj[
                itemkey
              ] = `Provider location with id '${location.id}' does not exist in the catalog provided in /on_search`;
            }
            providerLocExists = false;
          });
        }
      }
    }
  } catch (error) {
    console.log(
      `!!Error while checking provider object in /${constants.LOG_INIT}`,
      error
    );
  }

  //item check
  try {
    console.log(`Comparing item object in /init and /on_search`);
    let itemExists = false;

    itemsArr.forEach((item, i) => {
      onSearchitemsArr.forEach((element) => {
        if (item.id === element.id) itemExists = true;
        console.log(item.id, element.id);
      });
      if (!itemExists) {
        let itemkey = `itemErr${i}`;
        initObj[itemkey] = `Item Id '${item.id}' does not exist in /on_search`;
      } else {
        let itemObj = onSearchitemsArr.filter(
          (element) => item.id === element.id
        );
        itemObj = itemObj[0];
      }
      itemExists = false;
    });
  } catch (error) {
    console.log(
      `!!Error while checking items array in /on_init API`,
      error
    );
  }

  return initObj;
};

module.exports = checkInit;
