const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnInit = async (data, msgIdSet) => {
  const onInitObj = {};
  let onInit = data;
  onInit = onInit.message.order;
  let quote = onInit?.quote;
  let payments = onInit?.payments;
  let rfq = dao.getValue("rfq");

  try {
    console.log(`Checking payment object in /on_init api`);
    payments.forEach((payment) => {
      let type = payment?.type;
      let collectedBy = payment?.collected_by;
      let feeType = payment["@ondc/org/buyer_app_finder_fee_type"];
      let feeAmount = payment["@ondc/org/buyer_app_finder_fee_amount"];

      if (type === "PRE-FULFILLMENT" && collectedBy === "BPP" && !rfq) {
        if (!payment.uri) {
          onInitObj.msgUri = `Payment gateway link (uri) should be sent by BPP in case of prepaid orders`;
        }
        if (!payment?.tags) {
          onInitObj.msngPymntags = `/payments/tags are required for prepaid payments collected by BPP`;
        } else {
          payment?.tags.forEach((tag) => {
            let paymentTagsSet = new Set();
            if (tag?.descriptor?.code === "BPP_payment") {
              if (tag?.list) {
                tag.list.forEach((val) => {
               

                  paymentTagsSet.add(val?.descriptor?.code);
                });
                let missingTags = [];

                for (let tag of constants.BPP_PAYMENT_TAGS) {
                  if (!paymentTagsSet.has(tag)) {
                    missingTags.push(tag);
                  }
                }

                if (missingTags.length > 0) {
                  onInitObj.missingPymntTags = `${missingTags} are required in BPP_payment tag in /payments/tags`;
                }
              }
            } else {
              onInitObj.msngPymntags1 = `BPP_payment tag is missing in /payments/tags`;
            }
          });
        }
      }
      if (feeType != dao.getValue("buyerFinderFeeType")) {
        onInitObj.feeTypeErr = `Buyer Finder Fee type mismatches from /search`;
      }
      if (
        parseFloat(feeAmount) !=
        parseFloat(dao.getValue("buyerFinderFeeAmount"))
      ) {
        onInitObj.feeTypeErr = `Buyer Finder Fee amount mismatches from /search`;
      }
    });
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /on_init api`,
      error
    );
  }

  return onInitObj;
};
module.exports = checkOnInit;
