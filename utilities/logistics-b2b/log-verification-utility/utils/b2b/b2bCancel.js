const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");

const checkCancel = async (data, msgIdSet) => {
  const cancelObj = {};
  let cancel = data;
  cancel = cancel.message;
  let bap_cancel=false

  if(cancel.order_id && cancel.cancellation_reason_id) bap_cancel=true
 dao.setValue("bap_cancel",bap_cancel)
  return cancelObj;
};
module.exports = checkCancel;
