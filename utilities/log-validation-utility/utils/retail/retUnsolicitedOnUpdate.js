const logger = require("../logger");


const checkOnUpdateInitiated = require("./retOnUpdateInit");
const checkOnUpdateLiquidated = require("./retOnUpdateLiquidated");
const checkOnUpdateRejected = require("./retOnUpdateRejected");
const checkOnUpdateApproved = require("./retOnUpdateApproved");
const checkOnUpdatePicked = require("./retonUpdatePicked");
const checkOnUpdateDelivered = require("./retOnUpdateDelivered");
//itemsIdList
//temsUpdt
// quotePrice
const checkUnsolicitedOnUpdate = (dirPath, msgIdSet) => {
  let onUpdateObj = {};

  onUpdateObj.initiated = checkOnUpdateInitiated(
    dirPath,
    msgIdSet,
    "Return_Initiated"
  );

  onUpdateObj.liquidated = checkOnUpdateLiquidated(
    dirPath,
    msgIdSet,
    "Liquidated"
  );

  onUpdateObj.rejected = checkOnUpdateRejected(
    dirPath,
    msgIdSet,
    "Return_Rejected"
  );
  onUpdateObj.return_approved = checkOnUpdateApproved(
    dirPath,
    msgIdSet,
    "Return_Approved"
  );
  onUpdateObj.return_picked = checkOnUpdatePicked(
    dirPath,
    msgIdSet,
    "Return_Picked"
  );
  onUpdateObj.return_delivered = checkOnUpdateDelivered(
    dirPath,
    msgIdSet,
    "Return_Delivered"
  );

  return onUpdateObj;

  //on_update_initiated

  //liquidate
  // on_update liquidated

  //update_billing (refund)

  //   reject
  //rejected

  //   reverseQC
  // return approved
  // return picked
  //   return delivered;
};

module.exports = checkUnsolicitedOnUpdate;
