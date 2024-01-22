const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkConfirm = async (data, msgIdSet) => {
  const cnfrmObj = {};
  let confirm = data;
  confirm = confirm.message.order;
  let payments = confirm?.payments;

  try {
    console.log(`Checking payment object in /confirm api`);
    payments.forEach((payment) => {
      let feeType = payment["@ondc/org/buyer_app_finder_fee_type"];
      let feeAmount = payment["@ondc/org/buyer_app_finder_fee_amount"];

      if (feeType != dao.getValue("buyerFinderFeeType")) {
        onInitObj.feeTypeErr = `Buyer Finder Fee type mismatches from /search`;
      }
      if (parseFloat(feeAmount) != parseFloat(dao.getValue("buyerFinderFeeAmount"))) {
        onInitObj.feeTypeErr = `Buyer Finder Fee amount mismatches from /search`;
      }
    });
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /confirm api`,
      error
    );
  }

  return cnfrmObj;
};
module.exports = checkConfirm;
