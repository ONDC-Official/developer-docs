const checkOnStatus = require("./retOnStatus");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const logger = require("../logger");

const checkOnStatusPending = (dirPath, msgIdSet, state) => {
  try {
    let on_status = fs.readFileSync(
      dirPath + `/${constants.RET_ONSTATUS}_${state}.json`
    );
    on_status = JSON.parse(on_status);

    let pendingObj = {};
    pendingObj = checkOnStatus(msgIdSet, on_status, state);

    //timestamp validation

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_ONCONFIRM} and /${constants.RET_ONSTATUS}_${state} API`
      );
      if (_.gte(dao.getValue("tmstmp"), on_status.context.timestamp)) {
        pendingObj.tmpstmp1 = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_ONSTATUS}_${state} api`;
      }
      dao.setValue("tmpstmp", on_status.context.timestamp);
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing timestamp for /${constants.RET_ONSTATUS}_${state}, ${error.stack}`
      );
    }

    const contextTime = on_status.context.timestamp;
    on_status = on_status.message.order;
    try {
      logger.info(
        `Comparing order.updated_at and context timestamp for /${constants.RET_ONSTATUS}_${state} API`
      );

      if (!_.isEqual(on_status.updated_at, contextTime)) {
        pendingObj.tmpstmp2 = ` order.updated_at timestamp should match context timestamp for /${constants.RET_ONSTATUS}_${state} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing order updated at for /${constants.RET_ONSTATUS}_${state}, ${error.stack}`
      );
    }
    return pendingObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.error(
        `!!File not found for /${constants.RET_ONSTATUS}_${state} API!`
      );
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONSTATUS}_${state} API`,
        err
      );
    }
  }
};

module.exports = checkOnStatusPending;
