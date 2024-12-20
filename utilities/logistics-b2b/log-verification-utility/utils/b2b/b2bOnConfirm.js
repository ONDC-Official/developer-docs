const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnConfirm = async (data, msgIdSet) => {
  const onConfirmObj = {};
  let onConfirm = data;
  let errorObj = onConfirm.error;
  onConfirm = onConfirm.message.order;
  let quote = onConfirm?.quote;
  let prvdrLocation = onConfirm?.provider?.locations
  let payments = onConfirm?.payments;
  let fulfillments = onConfirm?.fulfillments
  let rfq = dao.getValue("rfq");
  prvdrLocation=prvdrLocation[0]

  if(onConfirm.state==='Cancelled' && !errorObj){
    onConfirmObj.errObj=`Error object is missing in case of PO rejection`
  }

  try {
    console.log("Checking fulfillments in /on_confirm");
    fulfillments.forEach(fulfillment=>{
        let stops = fulfillment?.stops

        stops.forEach(stop=>{
            if(stop?.type==='start'){
                if(stop?.location?.id!==prvdrLocation?.id){
                 onConfirmObj.strtlctnErr=`fulfillments/start/location/id - ${stop?.location?.id} is not matching with the provider location id - ${prvdrLocation?.id} provided in /on_search`
                }
            }
        })
    })
  } catch (error) {
    console.log("ERROR",error);
  }
  try {
    console.log(`Checking payment object in /on_confirm api`);

    payments.forEach((payment) => {
      let type = payment?.type;
      let collectedBy = payment?.collected_by;
      let feeType = payment["@ondc/org/buyer_app_finder_fee_type"];
      let feeAmount = payment["@ondc/org/buyer_app_finder_fee_amount"];

      if (type === "PRE-FULFILLMENT" && collectedBy === "BPP" && rfq) {
        if (!payment.uri) {
          onConfirmObj.msgUri = `Payment gateway link (uri) should be sent by BPP in case of prepaid orders`;
        }
        if (!payment?.tags) {
          onConfirmObj.msngPymntags = `/payments/tags are required for prepaid payments collected by BPP`;
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
                  onConfirmObj.missingPymntTags = `${missingTags} are required in BPP_payment tag in /payments/tags`;
                }
              }
            } else {
              onConfirmObj.msngPymntags1 = `BPP_payment tag is missing in /payments/tags`;
            }
          });
        }
      }
      if (feeType != dao.getValue("buyerFinderFeeType")) {
        onConfirmObj.feeTypeErr = `Buyer Finder Fee type mismatches from /search`;
      }
      if (
        parseFloat(feeAmount) !=
        parseFloat(dao.getValue("buyerFinderFeeAmount"))
      ) {
        onConfirmObj.feeTypeErr = `Buyer Finder Fee amount mismatches from /search`;
      }
    });
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /on_Confirm api`,
      error
    );
  }

  return onConfirmObj;
};
module.exports = checkOnConfirm;
