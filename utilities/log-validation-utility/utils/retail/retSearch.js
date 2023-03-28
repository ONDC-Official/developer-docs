const dao = require("../../dao/dao");
const fs = require("fs");
const utils = require("../utils");
const constants = require("../constants");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");

const checkSearch = (dirPath, msgIdSet) => {
  let srchObj = {};
  try {
    let search = fs.readFileSync(dirPath + `/${constants.RET_SEARCH}.json`);
    search = JSON.parse(search);

    try {
      console.log(`Checking context for ${constants.RET_SEARCH} API`); //context checking
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
      console.log(
        `!!Some error occurred while checking /${constants.RET_SEARCH} context`,
        error
      );
    }

    try {
      console.log(`Validating Schema for ${constants.RET_SEARCH} API`);
      const vs = validateSchema("retail", constants.RET_SEARCH, search);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(srchObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_SEARCH}`,
        error
      );
    }

    search = search.message.intent;
    try {
      console.log("Getting Buyer App finder fee amount");
      if (search.payment["@ondc/org/buyer_app_finder_fee_type"] != "percent") {
        srchObj.bffTyp = `Buyer app finder fee type should be "percent"`;
      }
      var buyerFF = parseFloat(
        search.payment["@ondc/org/buyer_app_finder_fee_amount"]
      );
      dao.setValue("buyerFF", buyerFF);
    } catch (error) {
      console.log("!!Error while fetching buyer app finder fee amount", error);
    }

    try {
      console.log("Checking GPS Precision in /search");
      if (search.hasOwnProperty("item")) {
        if (search.hasOwnProperty("fulfillment")) {
          const gps = search.fulfillment.end.location.gps.split(",");
          const gpsLat = gps[0];
          const gpsLong = gps[1];

          if (!gpsLat || !gpsLong) {
            srchObj.gpsErr = `location.gps is not as per the API contract`;
          }
          // else {
          //   if (
          //     utils.countDecimalDigits(gpsLat) !=
          //     utils.countDecimalDigits(gpsLong)
          //   ) {
          //     srchObj.gpsErr = `GPS Lat/Long Precision should be same `;
          //   }
          // }
        } else {
          srchObj.flfllmntObj = `Fulfillment object missing in /${constants.RET_SEARCH} API`;
        }
      }
    } catch (error) {
      console.log("!!Error while checking GPS Precision", error);
    }

    dao.setValue("srchObj", srchObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_SEARCH} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_SEARCH} API`,
        err
      );
    }
  }
};

module.exports = checkSearch;
