const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkConfirm = (data, msgIdSet) => {
  let cnfrmObj = {};
  let confirm = data;
  const contextTimestamp= confirm.context.timestamp
  let version = confirm.context.core_version;
  let missingTags =[];
  let onSearchProvArr = dao.getValue("providersArr");
  confirm = confirm.message.order;
  let rts;
  let linkedOrder = confirm["@ondc/org/linked_order"]
  if (confirm?.updated_at > contextTimestamp) {
    cnfrmObj.updatedAtErr = `order/updated_at cannot be future dated w.r.t context/timestamp`;
  }
  if (confirm?.created_at > contextTimestamp) {
    cnfrmObj.createdAtErr = `order/created_at cannot be future dated w.r.t context/timestamp`;
  }

  if (confirm.provider.locations && confirm.provider.locations.length > 1)
    dao.setValue("confirm_locations", confirm.provider.locations);

  if (version === "1.1.0")
    rts = confirm?.fulfillments[0]?.tags["@ondc/org/order_ready_to_ship"];
  else {
    let fulTags = confirm?.fulfillments[0].tags;
    fulTags.forEach((tag) => {
      if (tag.code === "state") {
        const lists = tag.list;
        lists.forEach((list) => {
          if (list.code === "ready_to_ship") {
            rts = list.value;
          }
        });
      }
    });
  }
  let provId = confirm.provider.id;
  let items = confirm.items;

  try {
    console.log(
      `Comparing item duration and timestamp in /on_search and /confirm`
    );
    2;
    items.forEach((item) => {
      if (item.time) {
        onSearchProvArr.forEach((provider) => {
          if (provider.id === provId) {
            const onSearchItemsObj = provider.items;
            onSearchItemsObj.forEach((onSrchItem) => {
              if (onSrchItem.id === item.id) {
                if (onSrchItem?.time?.duration !== item?.time?.duration)
                  cnfrmObj.itemDurationErr = `item duration does not match with the one provided in /on_search (LSP can send NACK)`;
                if (onSrchItem?.time?.timestamp !== item?.time?.timestamp)
                  cnfrmObj.itemTmstmpErr = `item timestamp does not match with the one provided in /on_search (LSP can send NACK)`;
              }
            });
          }
        });
      }
    });
  } catch (error) {}

  dao.setValue("rts", rts);
  const cnfrmOrdrId = confirm.id;
  dao.setValue("cnfrmOrdrId", cnfrmOrdrId);
  let awbNo = false;
  let fulfillments = confirm.fulfillments;

  let p2h2p = dao.getValue("p2h2p");
  let fulfillmentTagSet = new Set();
  fulfillments.forEach((fulfillment,i) => {
    let fulfillmentTags = fulfillment?.tags;
    let avgPickupTime= fulfillment?.start?.time?.duration;
console.log(avgPickupTime,dao.getValue(`${fulfillment?.id}-avgPickupTime`));
    if(avgPickupTime && dao.getValue(`${fulfillment?.id}-avgPickupTime`) && avgPickupTime!==dao.getValue(`${fulfillment?.id}-avgPickupTime`)){
      cnfrmObj.avgPckupErr=`Average Pickup Time (fulfillments/start/time/duration) mismatches from the one provided in /on_search`
    }
    if (fulfillment["@ondc/org/awb_no"] && p2h2p) awbNo = true;
    if (rts === "yes" && !fulfillment?.start?.instructions?.short_desc) {
      cnfrmObj.instructionsErr = `fulfillments/start/instructions are required when ready_to_ship = 'yes'`;
    }
     reqFulTags = ["rto_action","state"]
    //checking tags
    if (fulfillmentTags) {
      fulfillmentTags.forEach((tag) => {
        let { code, list } = tag;
        fulfillmentTagSet.add(code);
      })

      missingTags= utils.findRequiredTags(fulfillmentTagSet,reqFulTags)
       if (missingTags.length > 0) {
        let itemKey = `missingFlmntTags-${i}-err`;
        cnfrmObj[
          itemKey
        ] = `'${missingTags}' tag/s required in /fulfillments/tags`;
      }
    }
  });

  try {
    console.log("checking linked order in /confirm");

    let orderWeight =linkedOrder?.order?.weight?.value;
    const unit = linkedOrder?.order?.weight?.unit;

    if(unit === 'kilogram'){
      orderWeight = orderWeight*1000;
    }

    let totalUnitWeight=0;
    let quantityUnit;

    linkedOrder?.items.forEach(item=>{
      let quantity = item?.quantity?.measure?.value
       quantityUnit = item?.quantity?.measure?.unit
      if(quantityUnit === 'kilogram'){
        quantity = quantity*1000;
      }
      const count = item?.quantity?.count
      
      const unitWeight = (quantity*count)
       totalUnitWeight+=unitWeight;
    })

    console.log(totalUnitWeight,orderWeight);
    if(totalUnitWeight.toFixed(2)!=orderWeight.toFixed(2) && quantityUnit!== 'unit'){
      cnfrmObj.weightErr=`Total order weight '${orderWeight}' does not match the total unit weight of items '${totalUnitWeight}'`
    }
  } catch (error) {
    console.log(error);
  }
  dao.setValue("awbNo", awbNo);
  return cnfrmObj;
};

module.exports = checkConfirm;
