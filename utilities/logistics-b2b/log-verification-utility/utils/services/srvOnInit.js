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
  let feeType, feeAmount, settlementDetailsPresent, buyerFinderFeePresent;

  try {
    console.log(`Checking payment object in /on_init api`);
    payments.forEach((payment) => {
      let tags = payment.tags;
      let payment_collected = payment?.collected_by;
      tags.forEach((tag) => {
        if (tag?.descriptor?.code === "Settlement_Details") {
          settlementDetailsPresent = true;
          if (tag?.list) {
            tag.list.forEach((val) => {
              if (val?.descriptor?.code === "Counterparty") {
                let counterparty = val?.value;
                if (payment_collected === "BAP" && counterparty === "BAP") {
                  onInit.cntrprty = `Counterparty will be BPP when BAP is collecting the payment`;
                }
              }
            });
          }
        }
        if (tag?.descriptor?.code === "Buyer_Finder_Fee" && tag?.list) {
          buyerFinderFeePresent = true;
          tag.list.forEach((val) => {
            if (val?.descriptor?.code === "Buyer_Finder_Fee_Type") {
              feeType = val?.value;
            }
            if (val?.descriptor?.code === "Buyer_Finder_Fee_Amount") {
              feeAmount = val?.value;
            }
          });
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

      if (payment_collected === "BAP" && !settlementDetailsPresent) {
        onInitObj.sttlmntDtls = `Settlement details should be sent by BPP in payments/tags when BAP is collecting the payment`;
      }
      if (!buyerFinderFeePresent) {
        onInitObj.sttlmntDtls = `Buyer Finder Fee should be sent by BPP in payments/tags`;
      }
    });
  } catch (error) {
    console.log(`!!Error while checking payment object in /on_init api`, error);
  }

  return onInitObj;
};
module.exports = checkOnInit;
