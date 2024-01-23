const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkConfirm = async (data, msgIdSet) => {
  const cnfrmObj = {};
  let confirm = data;
  confirm = confirm.message.order;
  let orderState = confirm.state;
  let payments = confirm?.payments;

  let items = confirm.items;
  const selectedItems = dao.getValue("slctdItemsArray");

  try {
    console.log("Comparing items object with /select");
    const itemDiff = utils.findDifferencesInArrays(items, selectedItems);
    console.log(itemDiff);
    itemDiff.forEach((item, i) => {
      let itemkey = `item-${i}-DiffErr`;
      cnfrmObj[
        itemkey
      ] = `In /items, '${item.attributes}' mismatch from /select`;
    });
  } catch (error) {
    console.log(error);
  }

  try {
    console.log(`Checking payment object in /confirm api`);
    payments.forEach((payment) => {
      let feeType = payment["@ondc/org/buyer_app_finder_fee_type"];
      let feeAmount = payment["@ondc/org/buyer_app_finder_fee_amount"];
      let paymentStatus = payment?.status;
      let paymentType = payment?.type;
      let params = payment?.params;

      if (feeType != dao.getValue("buyerFinderFeeType")) {
        cnfrmObj.feeTypeErr = `Buyer Finder Fee type mismatches from /search`;
      }
      if (
        parseFloat(feeAmount) !=
        parseFloat(dao.getValue("buyerFinderFeeAmount"))
      ) {
        cnfrmObj.feeTypeErr = `Buyer Finder Fee amount mismatches from /search`;
      }

      if (paymentStatus === "PAID" && !params?.transaction_id) {
        cnfrmObj.pymntErr = `Transaction ID in payments/params is required when the payment status is 'PAID'`;
      }
      if (paymentStatus === "NOT-PAID" && params?.transaction_id) {
        cnfrmObj.pymntErr = `Transaction ID in payments/params cannot be provided when the payment status is 'NOT-PAID'`;
      }
      if (
        paymentType === "ON-FULFILLMENT" &&
        orderState != "Completed" &&
        paymentStatus === "PAID"
      ) {
        cnfrmObj.pymntstsErr = `Payment status will be 'PAID' once the order is 'Completed' for payment type 'ON-FULFILLMENT'`;
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
