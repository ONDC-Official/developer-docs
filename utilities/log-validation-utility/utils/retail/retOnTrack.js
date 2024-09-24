const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");
const logger = require("../logger");

const checkOnTrack = (dirPath, msgIdSet) => {
  let onTrckObj = {};
  try {
    let on_track = fs.readFileSync(dirPath + `/${constants.RET_ONTRACK}.json`);
    on_track = JSON.parse(on_track);
    try {
      logger.info(`Validating Schema for /${constants.RET_ONTRACK} API`);
      const vs = validateSchema("retail", constants.RET_ONTRACK, on_track);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(onTrckObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONTRACK}, ${error.stack}`
      );
    }

    logger.info(`Checking context for /${constants.RET_ONTRACK} API`); //checking context
    try {
      res = checkContext(on_track.context, "on_track");
      if (!res.valid) {
        Object.assign(onTrckObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONTRACK} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONTRACK}`
      );
      if (!_.isEqual(dao.getValue("city"), on_track.context.city)) {
        onTrckObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONTRACK}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONTRACK}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_ONTRACK} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_track.context.timestamp)) {
        onTrckObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_ONTRACK} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_ONTRACK} api`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_TRACK} and /${constants.RET_ONTRACK}`
      );
      if (_.gte(dao.getValue("trckTmpstmp"), on_track.context.timestamp)) {
        onTrckObj.tmpstmp = `Timestamp for /${constants.RET_TRACK} api cannot be greater than or equal to /${constants.RET_ONTRACK} api`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_TRACK} and /${constants.RET_ONTRACK} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONTRACK}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_track.context.transaction_id)) {
        onTrckObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONTRACK} api, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking Message Id of /${constants.RET_ONTRACK}`);
      if (!_.isEqual(dao.getValue("msgId"), on_track.context.message_id)) {
        onTrckObj.msgId = `Message Id for /${constants.RET_TRACK} and /${constants.RET_ONTRACK} api should be same`;
      }

      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_track.context.message_id);
    } catch (error) {
      logger.error(
        `!!Error while checking message id for /${constants.RET_ONTRACK}, ${error.stack}`
      );
    }

    on_track = on_track.message.tracking;

    try {
      logger.info(
        `Checking tracking URL when status is active (/${constants.RET_ONTRACK})`
      );
      if (on_track.status === "active" && !on_track.url) {
        onTrckObj.onTrackUrl =
          "Tracking url can't be null when status is active";
      }
    } catch (error) {
      logger.error(
        `!!Error while checking tracking url in /${constants.RET_ONTRACK}, ${error.stack}`
      );
      // onTrckObj.onTrackUrl =
      //   "Tracking url can't be null in case status is active";
    }

    // dao.setValue("onTrckObj", onTrckObj);
    return onTrckObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_ONTRACK} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONTRACK} API`,
        err
      );
    }
  }
};

module.exports = checkOnTrack;
