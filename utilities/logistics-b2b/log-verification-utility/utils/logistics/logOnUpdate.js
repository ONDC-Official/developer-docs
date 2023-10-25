const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkOnUpdate = (data, msgIdSet) => {
  let onUpdtObj = {};
  let on_update = data;
  let contextTimestamp = on_update?.context?.timestamp;
  let rts = dao.getValue("rts");
  on_update = on_update.message.order;
  let fulfillments = on_update.fulfillments;
  let items = on_update.items;
  let p2h2p = dao.getValue("p2h2p");
  let awbNo = dao.getValue("awbNo");
  let locationsPresent = dao.getValue("confirm_locations");

  if (on_update?.updated_at > contextTimestamp) {
    onUpdtObj.updatedAtErr = `order/updated_at cannot be future dated w.r.t context/timestamp`;
  }

  if (locationsPresent) {
    if (!_.isEqual(on_update?.provider?.locations, locationsPresent)) {
      onUpdtObj.locationsErr = `order/provider/locations mismatch between /confirm and /on_update`
    }
  }
  try {
    console.log(
      `Checking if start and end time range required in /on_update api`
    );
    fulfillments.forEach((fulfillment) => {
      if (fulfillment["@ondc/org/awb_no"]) {
        awbNo = true;
      }
      if (!awbNo && p2h2p) {
        onUpdtObj.awbNoErr =
          "AWB No (@ondc/org/awb_no) is required in /fulfillments for P2H2P shipments (may be provided in /confirm or /update by logistics buyer or /on_confirm or /on_update by LSP)";
      }
      if (awbNo && !p2h2p) {
        onUpdtObj.awbNoErr =
          "AWB No (@ondc/org/awb_no) is not required for P2P fulfillments";
      }
      if (rts === "yes" && !fulfillment?.start?.time?.range) {
        onUpdtObj.strtRangeErr = `start/time/range is required in /fulfillments when ready_to_ship = yes in /update`;
      }
      if (rts === "yes" && !fulfillment?.end?.time?.range) {
        onUpdtObj.endRangeErr = `end/time/range is required in /fulfillments when ready_to_ship = yes in /update`;
      }

      if (p2h2p && !fulfillment?.start?.instructions?.images) {
        onUpdtObj.shipLblErr = `Shipping label (/start/instructions/images) is required for P2H2P shipments`;
      }
    });
  } catch (error) {
    console.log(`!!Error while checking fulfillments in /on_update api`, error);
  }

  return onUpdtObj;
};

module.exports = checkOnUpdate;
