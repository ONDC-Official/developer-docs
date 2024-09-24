const dao = require("../../dao/dao");
const fs = require("fs");
const utils = require("../utils");
const constants = require("../constants");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const logger = require("../logger");

const checkSearch = (dirPath, msgIdSet) => {
  let srchObj = {};
  try {
    let search = fs.readFileSync(dirPath + `/${constants.RET_SEARCH}.json`);
    search = JSON.parse(search);

    try {
      logger.info(`Checking context for ${constants.RET_SEARCH} API`); //context checking
      res = checkContext(search.context, constants.RET_SEARCH);
      dao.setValue("tmpstmp", search.context.timestamp);
      dao.setValue("txnId", search.context.transaction_id);
      dao.setValue("msgId", search.context.message_id);
      dao.setValue("city", search.context.city);
      msgIdSet.add(search.context.message_id);
      if (!res.valid) {
        Object.assign(srchObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_SEARCH} context, ${error.stack}`
      );
    }

    try {
      logger.info(`Validating Schema for ${constants.RET_SEARCH} API`);
      const vs = validateSchema("retail", constants.RET_SEARCH, search);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(srchObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_SEARCH}, ${error.stack}`
      );
    }

    search = search.message.intent;
    try {
      logger.info("Getting Buyer App finder fee amount");
      // if (search.payment["@ondc/org/buyer_app_finder_fee_type"] != "percent") {
      //   srchObj.bffTyp = `Buyer app finder fee type should be "percent"`;
      // }
      var buyerFF = parseFloat(
        search.payment["@ondc/org/buyer_app_finder_fee_amount"]
      );
      dao.setValue("buyerFF", buyerFF);
    } catch (error) {
      logger.error("!!Error while fetching buyer app finder fee amount", error);
    }

    try {
      logger.info("Checking GPS Precision in /search");
      const has = Object.prototype.hasOwnProperty;
      if (has.call(search, "item")) {
        if (has.call(search, "fulfillment")) {
          const gps = search.fulfillment.end.location.gps;

          if (!utils.checkGpsPrecision(gps)) {
            srchObj.gpsPrecision = `fulfillment/end/location/gps coordinates must be specified with at least six decimal places of precision.`;
          }
        }
      }
    } catch (error) {
      logger.error("!!Error while checking GPS Precision", error);
    }

    return srchObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_SEARCH} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_SEARCH} API`,
        err
      );
    }
  }
};

module.exports = checkSearch;
