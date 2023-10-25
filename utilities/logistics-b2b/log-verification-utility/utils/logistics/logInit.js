const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkInit = (data, msgIdSet) => {
  const billing = data.message.order.billing
  const billingAdd= billing.address
  const len = billingAdd.name.length + billingAdd.building.length +billingAdd.locality.length
  console.log(billingAdd.name.length,billingAdd.building.length,billingAdd.locality.length);
  console.log("length",len);
  if (billingAdd.name.length + billingAdd.building.length +billingAdd.locality.length > 190) return true
  else false
  const initObj = {};
  let init = data;
  let p2h2p = false;
  init = init.message.order;

  let itemsArr = init.items;
  let fulfillmentsArr = init.fulfillments;
  let bppFulfillmentsArr = dao.getValue("bppFulfillmentsArr");
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
      if (!providerObj || providerObj?.length < 1) {
        initObj.prvdrErr = `Provider with id '${init.provider.id}' does not exist in the catalog provided in /on_search`;
      } else {
        if (
          (!init?.provider?.locations || init?.provider?.locations?.length < 1) &&
          providerObj[0]?.locations?.length>1
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

    itemsArr?.forEach((item, i) => {
      if (item.descriptor.code === "P2H2P") {
        p2h2p = true;
      }
      onSearchitemsArr?.forEach((element) => {
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
        if (item.category_id != itemObj.category_id) {
          let itemkey = `catIdErr${i}`;
          initObj[
            itemkey
          ] = `Category id '${item.category_id}' for item with id '${item.id}' does not match with the catalog provided in /on_search`;
        }
        if (item.descriptor.code != itemObj.descriptor.code) {
          let itemkey = `codeErr${i}`;
          initObj[
            itemkey
          ] = `Descriptor code '${item.descriptor.code}' for item with id '${item.id}' does not match with the catalog provided in /on_search`;
        }
        fulfillmentsArr.forEach((fulfillment, i) => {
          if (fulfillment.id !== itemObj.fulfillment_id) {
            let itemkey = `flfillmentErr${i}`;
            initObj[
              itemkey
            ] = `Fulfillment id '${fulfillment.id}' for item with id '${item.id}' does not match with the catalog provided in /on_search`;
          } else {
            let bppfulfillment = bppFulfillmentsArr?.find(
              (element) => element.id === fulfillment.id
            );
            if (fulfillment.type !== bppfulfillment?.type) {
              let itemkey = `flfillmentTypeErr${i}`;
              initObj[
                itemkey
              ] = `Fulfillment type '${fulfillment.type}' for fulfillment id '${fulfillment.id}' does not match with the catalog provided in /on_search`;
            }
          }
        });
      }
      itemExists = false;
    });
  } catch (error) {
    console.log(
      `!!Error while checking items array in /${constants.log_INIT}`,
      error
    );
  }
  dao.setValue("p2h2p", p2h2p);
  return initObj;
};
module.exports = checkInit;