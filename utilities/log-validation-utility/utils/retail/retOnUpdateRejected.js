const constants = require("../constants");
const checkOnUpdate = require("./retOnUpdate");
const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const logger = require("../logger");

const checkOnUpdateRejected = (dirPath, msgIdSet, state) => {
  try {
    let on_update = fs.readFileSync(
      dirPath + `/${constants.RET_ONUPDATE}_rejected.json`
    );
    let compareApi = `/${constants.RET_ONSTATUS}_delivered`;

    const initiatedOnUpdate = fs.existsSync(
      dirPath + `/${constants.RET_ONUPDATE}_initiated.json`
    );
    //setting comparison API to the previous recentmost API
    if (initiatedOnUpdate) {
      compareApi = `/${constants.RET_ONUPDATE}_initiated`;
    }

    //parsing the on_update call
    on_update = JSON.parse(on_update);

    let rejectedObj = {};
    rejectedObj = checkOnUpdate(msgIdSet, on_update, state);

    const contextTime = on_update.context.timestamp;
    on_update = on_update.message.order;
    //timestamp validations

    try {
      logger.info(
        `Comparing timestamp of ${compareApi}  and /${constants.RET_ONUPDATE}_${state} API`
      );
      if (_.gte(dao.getValue("tmstmp"), contextTime)) {
        rejectedObj.tmpstmp1 = `Timestamp for ${compareApi} api cannot be greater than or equal to /${constants.RET_ONUPDATE}_${state} api`;
      }
      dao.setValue("tmpstmp", contextTime);
    } catch (error) {
      logger.error(
        `!!Error occurred while comparing context/timestamp for /${constants.RET_ONUPDATE}_${state}, ${error.stack}`
      );
    }
    return rejectedObj;
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

module.exports = checkOnUpdateRejected;
