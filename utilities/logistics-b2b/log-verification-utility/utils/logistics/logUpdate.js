const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkUpdate = (data, msgIdSet) => {
  let updtObj = {};
  let update = data;
  let version = update.context.core_version;
  let p2h2p = dao.getValue("p2h2p");
  let awbNo= dao.getValue("awbNo");

  dao.setValue("updateApi",true)

  update = update.message.order;
  if (version === "1.1.0")
  rts = update?.fulfillments[0]?.tags["@ondc/org/order_ready_to_ship"];
else {
  let fulTags = update?.fulfillments[0].tags;
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
  dao.setValue("rts", rts);
  let items = update.items;
  let fulfillments = update.fulfillments;

  try {
    console.log(`Checking if PCC code required in case of P2P/P2H2P shipments`);

    fulfillments.forEach((fulfillment) => {
      
      if(fulfillment["@ondc/org/awb_no"] && p2h2p) awbNo= true;
      if (
        rts === "yes" &&
        !p2h2p &&
        !fulfillment?.start &&
        !fulfillment?.start?.instructions?.short_desc
      ) {
        updtObj.startErr = `/fulfillments/start is required when ready_to_ship = yes for P2P shipments`;
      }
      else if(rts === 'yes' && p2h2p && fulfillment?.start?.instructions?.short_desc){
        
        updtObj.instrctnsErr = `Pickup code is not required for P2H2P shipments as shipping label is provided by LSP`;
      }
    });
  } catch (error) {
    console.log(`Error checking fulfillments/start in /update`);
  }
  dao.setValue("awbNo",awbNo);
  return updtObj;
};

module.exports = checkUpdate;