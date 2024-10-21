const constants = require("../constants");
const checkOnUpdate = require("./retOnUpdate");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const logger = require("../logger");

const checkOnUpdateInitiated = (dirPath, msgIdSet, state) => {
  try {
    let on_update = fs.readFileSync(
      dirPath + `/${constants.RET_ONUPDATE}_initiated.json`
    );

    //parsing the on_update call
    on_update = JSON.parse(on_update);

    let initdObj = {};
    initdObj = checkOnUpdate(msgIdSet, on_update, state);

    const contextTime = on_update.context.timestamp;
    on_update = on_update.message.order;
    //timestamp validations

    try {
      logger.info(
        `Comparing timestamp of ${constants.RET_ONSTATUS}_delivered  and /${constants.RET_ONUPDATE}_${state} API`
      );
      if (_.gte(dao.getValue("tmstmp"), contextTime)) {
        initdObj.tmpstmp1 = `Timestamp for ${constants.RET_ONSTATUS}_delivered api cannot be greater than or equal to /${constants.RET_ONUPDATE}_${state} api`;
      }
      dao.setValue("tmpstmp", contextTime);
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing context/timestamp for /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
      );
    }
    return initdObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.error(
        `!!File not found for /${constants.RET_ONUPDATE}_${state} API!`
      );
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONUPDATE}_${state} API`,
        err
      );
    }
  }
};

module.exports = checkOnUpdateInitiated;
