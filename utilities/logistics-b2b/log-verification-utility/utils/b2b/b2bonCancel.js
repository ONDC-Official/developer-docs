const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkOnCancel = async (data, msgIdSet) => {
  const onCancelObj = {};
  let onCancel = data;
  let bap_id = onCancel.context.bap_id;
  let bpp_id = onCancel.context.bpp_id;
  onCancel = onCancel.message.order;
  let quote = onCancel?.quote;
  //   let payments = onCancel?.payments;
  //   let rfq = dao.getValue("rfq");
  let bap_cancel = dao.getValue("bap_cancel");


  if (bap_cancel && onCancel?.cancellation?.cancelled_by !== bap_id) {
    onCancelObj.cancelledByErr = `In case of buyer cancellation, cancellation/cancelled_by should be bap_id`;
  }

  if(!bap_cancel && onCancel?.cancellation?.cancelled_by !== bpp_id){
    onCancelObj.cancelledByErr1 = `In case of seller cancellation, cancellation/cancelled_by should be bpp_id`;
  }
  try {
    console.log("Checking refund element in quote in /on_cancel");
    let refundPresent = false;
    quote?.breakup.forEach((breakup) => {
      if (breakup["@ondc/org/title_type"] === "refund") refundPresent = true;
    });

    if (!refundPresent)
      onCancelObj.rfndPresent = `A refund line item needs to be included in the quote breakup to reimburse certain charges from the quote.`;
  } catch (error) {
    console.log("ERROR", error);
  }

  return onCancelObj;
};
module.exports = checkOnCancel;
