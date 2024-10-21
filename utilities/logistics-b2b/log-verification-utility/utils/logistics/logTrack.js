const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkTrack = (data, msgIdSet) => {
  let trackObj = {};
  let track = data;

  let trackId = track.message.order_id;
  dao.setValue("trackOrderId", trackId);
};

module.exports = checkTrack;
