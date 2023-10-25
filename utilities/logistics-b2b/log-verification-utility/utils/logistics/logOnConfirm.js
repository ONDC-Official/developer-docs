const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const utils = require("../utils");

const constants = require("../constants");

const checkOnConfirm = (data, msgIdSet) => {
  let on_confirm = data;
  const onCnfrmObj = {};

  on_confirm = on_confirm.message.order;
  let fulfillments = on_confirm.fulfillments;
  let rts = dao.getValue("rts");
  let p2h2p = dao.getValue("p2h2p")
  let awbNo= dao.getValue("awbNo");
  try {
    console.log(`checking start and end time range in fulfillments`);
    fulfillments.forEach((fulfillment) => {
      if(fulfillment["@ondc/org/awb_no"] && p2h2p) awbNo= true;
      console.log("rts",rts)
   
      if (rts === "yes" && !fulfillment?.start?.time?.range) {
       
        onCnfrmObj.strtRangeErr = `start/time/range is required in /fulfillments when ready_to_ship = yes in /confirm`;
      }
      if (rts === "yes" && !fulfillment?.end?.time?.range) {
        onCnfrmObj.endRangeErr = `end/time/range is required in /fulfillments when ready_to_ship = yes in /confirm`;
      }
    });

  } catch (error) {
    console.log(`Error checking fulfillment object in /on_confirm`);
  }
 
  dao.setValue("awbNo",awbNo);
  return onCnfrmObj;
};
module.exports = checkOnConfirm;