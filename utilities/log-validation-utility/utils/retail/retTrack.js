const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");

const checkTrack = (dirPath, msgIdSet) => {
  let trckObj = {};
  try {
    let track = fs.readFileSync(dirPath + `/${constants.RET_TRACK}.json`);
    track = JSON.parse(track);

    try {
      console.log(`Validating Schema for ${constants.RET_TRACK} API`);
      const vs = validateSchema("retail", constants.RET_TRACK, track);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(trckObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_TRACK}`,
        error
      );
    }

    try {
      console.log(`Checking context for /${constants.RET_TRACK}rack API`); //checking context
      res = checkContext(track.context, constants.RET_TRACK);
      if (!res.valid) {
        Object.assign(trckObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_TRACK} context`
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_TRACK}`
      );
      if (!_.isEqual(dao.getValue("city"), track.context.city)) {
        trckObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_TRACK}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_TRACK}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_TRACK} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), track.context.timestamp)) {
        dao.setValue("trckTmpstmp", track.context.timestamp);
        trckObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_TRACK} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_TRACK} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /select and /${constants.RET_TRACK}`
      );
      if (!_.isEqual(dao.getValue("txnId"), track.context.transaction_id)) {
        trckObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /select and /${constants.RET_TRACK} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.RET_TRACK}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /select and /on_select api should be same";
      // }

      if (msgIdSet.has(track.context.message_id)) {
        trckObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", track.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.RET_TRACK}`
      );
    }

    track = track.message;

    try {
      console.log(
        `Checking Order Id in /${constants.RET_TRACK} and /${constants.RET_CONFIRM}`
      );
      if (track.order_id != dao.getValue("cnfrmOrdrId")) {
        console.log(
          `Order Id in /${constants.RET_TRACK} and /${constants.RET_CONFIRM} do not match`
        );
        trckObj.trackOrdrId = `Order Id in /${constants.RET_TRACK} and /${constants.RET_CONFIRM} do not match`;
      }
    } catch (error) {
      console.log(
        `Error while comparing order id in /${constants.RET_TRACK} and /${constants.RET_CONFIRM}`,
        error
      );
      // trckObj.trackOrdrId = "Order Id in /${constants.RET_TRACK} and /${constants.RET_ONCONFIRM} do not match";
    }
    dao.setValue("trckObj", trckObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_TRACK} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_TRACK} API`,
        err
      );
    }
  }
};

module.exports = checkTrack;
