const checkOnStatusDelivered = require("./retOnStatusDelivered");
const checkOnStatusPending = require("./retOnStatusPending");
const checkOnStatusPicked = require("./retOnStatusPicked");

const logger = require("../logger");

const checkUnsolicitedStatus = (dirPath, msgIdSet) => {
  let onStatObj = {};

  onStatObj.pending = checkOnStatusPending(dirPath, msgIdSet, "pending");

  onStatObj.picked = checkOnStatusPicked(dirPath, msgIdSet, "picked");

  onStatObj.delivered = checkOnStatusDelivered(dirPath, msgIdSet, "delivered");

  // dao.setValue("onStatObj", onStatObj);
  return onStatObj;
};

module.exports = checkUnsolicitedStatus;
