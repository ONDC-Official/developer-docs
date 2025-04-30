const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkSelect = async (data, msgIdSet) => {
  const selectObj = {};
  let select = data;
  let rfq = false;
  if (select?.context?.ttl!=='PT30S') rfq = true;
  let citycode = select?.context?.location?.city?.code;
  select = select.message.order;
  let fulfillments = select?.fulfillments;

  let providersArr = dao.getValue("providersArr");
  let fulfillmentsArr = dao.getValue("fulfillmentsArr");
  let itemsArr = select.items;
  dao.setValue("slctdItemsArray", itemsArr);


 

  dao.setValue("rfq", rfq);

  // provider check
  try {
    console.log(`Comparing provider object in /select and /on_search`);
    if (select.provider) {
      onSearchitemsArr = dao.getValue(`${select.provider.id}itemsArr`);
      let providerObj = providersArr?.filter(
        (prov) => prov.id === select.provider.id
      );
      if (!providerObj || providerObj?.length < 1) {
        selectObj.prvdrErr = `Provider with id '${select.provider.id}' does not exist in the catalog provided in /on_search`;
      } else {
        if (
          (!select?.provider?.locations ||
            select?.provider?.locations?.length < 1) &&
          providerObj[0]?.locations?.length > 1
        ) {
          selectObj.provLocErr = `Provider location is mandatory if provided in the catalog in /on_search`;
        } else if (select?.provider?.locations) {
          let providerLocArr = select.provider.locations;
          let providerLocExists = false;
          providerLocArr.forEach((location, i) => {
            providerObj[0]?.locations?.forEach((element) => {
              console.log(location.id, element.id);

              if (location.id === element.id) providerLocExists = true;
            });

            if (!providerLocExists) {
              let itemkey = `providerLocErr${i}`;
              selectObj[
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
      `!!Error while checking provider object in /${constants.LOG_select}`,
      error
    );
  }

  //item check
  try {
    console.log(`Comparing item object in /select and /on_search`);

    itemsArr?.forEach((item, i) => {
      let itemTags = item?.tags;

      if(itemTags && !rfq){
        selectObj.itemTagErr=`items/tags (BUYER TERMS) should not be provided for Non-RFQ Flow`
      }
      let itemExists = false;
      onSearchitemsArr?.forEach((element) => {
        if (item.id === element.id) itemExists = true;
      });
      if (!itemExists) {
        let itemkey = `itemErr${i}`;
        selectObj[
          itemkey
        ] = `Item Id '${item.id}' does not exist in /on_search`;
      } else {
        let itemObj = onSearchitemsArr.filter(
          (element) => element.id === item.id
        );

        itemObj = itemObj[0];
        // dao.setValue("selectedItem", itemObj.id);
        console.log(itemObj.id);
        if (
          !_.every(item.fulfillment_ids, (element) =>
            _.includes(itemObj.fulfillment_ids, element)
          )
        ) {
          let itemkey = `flflmntIdErr${i}`;
          selectObj[
            itemkey
          ] = `Fulfillment ids for item with id '${item.id}' does not match with the catalog provided in /on_search`;
        }
        if (
          !_.every(item.location_ids, (element) =>
            _.includes(itemObj.location_ids, element)
          )
        ) {
          let itemkey = `lctnIdErr${i}`;
          selectObj[
            itemkey
          ] = `Location ids for item with id '${item.id}' does not match with the catalog provided in /on_search`;
        }

        //checking fulfillments
        fulfillments.forEach((fulfillment, i) => {
          let fulfillmentTags = fulfillment?.tags;
          
          if (citycode === "std:999" && !fulfillmentTags) {
            selectObj.fullfntTagErr = `Delivery terms (INCOTERMS) are required for exports in /fulfillments/tags`;
          }
          let bppfulfillment = fulfillmentsArr?.find(
            (element) => element.id === fulfillment.id
          );
          if (!bppfulfillment) {
            let itemkey = `flfillmentIDerr${i}`;
            selectObj[
              itemkey
            ] = `Fulfillment id '${fulfillment.id}' does not match with the catalog provided in /on_search`;
          } else if (fulfillment.type !== bppfulfillment?.type) {
            let itemkey = `flfillmentTypeErr${i}`;
            selectObj[
              itemkey
            ] = `Fulfillment type '${fulfillment.type}' for fulfillment id '${fulfillment.id}' does not match with the catalog provided in /on_search`;
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  return selectObj;
};
module.exports = checkSelect;
