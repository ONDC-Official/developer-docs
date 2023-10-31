const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkConfirm = (data, msgIdSet) => {
  let cnfrmObj = {};
  let confirm = data;
  let version = confirm.context.core_version;
  let onSearchProvArr = dao.getValue("providersArr");
  confirm = confirm.message.order;
  let rts;
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
              //console.log(onSrchItem);
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
  fulfillments.forEach((fulfillment) => {
    if (fulfillment["@ondc/org/awb_no"] && p2h2p) awbNo = true;
    if (
      rts === "yes" &&
      !fulfillment?.start?.instructions?.short_desc
    ) {
      cnfrmObj.instructionsErr = `fulfillments/start/instructions are required when ready_to_ship = 'yes'`;
    }
  });

  dao.setValue("awbNo", awbNo);
  return cnfrmObj;
};

module.exports = checkConfirm;
