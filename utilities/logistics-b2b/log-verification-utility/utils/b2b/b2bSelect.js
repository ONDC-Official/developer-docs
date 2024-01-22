const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkSelect = async (data, msgIdSet) => {
  const selectObj = {};
  let select = data;
  select = select.message.order;
  let itemIdList;
  let fulfillments = select?.fulfillments;
  
  fulfillments.forEach(fulfillment => {

    const fulId= fulfillment?.id
    const fulType = fulfillment?.type

    console.log("Checking if the fulfillment id and type in /select present in /on_search")
    
    
  });


  //provider check
  // try {
  //   console.log(`Comparing provider object in /select and /on_search`);
  //   if (select.provider) {
  //     onSearchitemsArr = dao.getValue(`${select.provider.id}itemsArr`);
  //     let providerObj = providersArr?.filter(
  //       (prov) => prov.id === select.provider.id
  //     );
  //     if (!providerObj || providerObj?.length < 1) {
  //       selectObj.prvdrErr = `Provider with id '${select.provider.id}' does not exist in the catalog provided in /on_search`;
  //     } else {
  //       if (
  //         (!select?.provider?.locations ||
  //           select?.provider?.locations?.length < 1) &&
  //         providerObj[0]?.locations?.length > 1
  //       ) {
  //         selectObj.provLocErr = `Provider location is mandatory if provided in the catalog in /on_search`;
  //       } else if (select?.provider?.locations) {
  //         let providerLocArr = select.provider.locations;
  //         let providerLocExists = false;
  //         providerLocArr.forEach((location, i) => {
  //           providerObj[0]?.locations?.forEach((element) => {
  //             console.log(location.id, element.id);

  //             if (location.id === element.id) providerLocExists = true;
  //           });

  //           if (!providerLocExists) {
  //             let itemkey = `providerLocErr${i}`;
  //             selectObj[
  //               itemkey
  //             ] = `Provider location with id '${location.id}' does not exist in the catalog provided in /on_search`;
  //           }
  //           providerLocExists = false;
  //         });
  //       }
  //     }
  //   }
  // } catch (error) {
  //   console.log(
  //     `!!Error while checking provider object in /${constants.LOG_select}`,
  //     error
  //   );
  // }

  // //item check
  // try {
  //   console.log(`Comparing item object in /select and /on_search`);
  //   let itemExists = false;

  //   itemsArr?.forEach((item, i) => {
  //     if (item.descriptor.code === "P2H2P") {
  //       p2h2p = true;
  //     }
  //     onSearchitemsArr?.forEach((element) => {
  //       if (item.id === element.id) itemExists = true;
  //     });
  //     if (!itemExists) {
  //       let itemkey = `itemErr${i}`;
  //       selectObj[
  //         itemkey
  //       ] = `Item Id '${item.id}' does not exist in /on_search`;
  //     } else {
  //       let itemObj = onSearchitemsArr.filter(
  //         (element) => item.id === element.id
  //       );

  //       itemObj = itemObj[0];
  //       dao.setValue("selectedItem", itemObj.id);
  //       console.log(itemObj.id);
  //       if (item.category_id != itemObj.category_id) {
  //         let itemkey = `catIdErr${i}`;
  //         selectObj[
  //           itemkey
  //         ] = `Category id '${item.category_id}' for item with id '${item.id}' does not match with the catalog provided in /on_search`;
  //       }
  //       if (item.descriptor.code != itemObj.descriptor.code) {
  //         let itemkey = `codeErr${i}`;
  //         selectObj[
  //           itemkey
  //         ] = `Descriptor code '${item.descriptor.code}' for item with id '${item.id}' does not match with the catalog provided in /on_search`;
  //       }
  //       fulfillmentsArr.forEach((fulfillment, i) => {
  //         if (fulfillment.id !== itemObj.fulfillment_id) {
  //           let itemkey = `flfillmentErr${i}`;
  //           selectObj[
  //             itemkey
  //           ] = `Fulfillment id '${fulfillment.id}' for item with id '${item.id}' does not match with the catalog provided in /on_search`;
  //         } else {
  //           let bppfulfillment = bppFulfillmentsArr?.find(
  //             (element) => element.id === fulfillment.id
  //           );
  //           if (fulfillment.type !== bppfulfillment?.type) {
  //             let itemkey = `flfillmentTypeErr${i}`;
  //             selectObj[
  //               itemkey
  //             ] = `Fulfillment type '${fulfillment.type}' for fulfillment id '${fulfillment.id}' does not match with the catalog provided in /on_search`;
  //           }
  //         }
  //       });
  //     }
  //     itemExists = false;
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  // try {
  //   console.log("Checking fulfillment object in /select");
  //   if (fulfillments) {
  //     fulfillments.forEach((fulfillment) => {
  //       ffId = fulfillment?.id;
  //       ffState = fulfillment?.state?.descriptor?.code;
  //     });
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  return selectObj;
};
module.exports = checkSelect;
