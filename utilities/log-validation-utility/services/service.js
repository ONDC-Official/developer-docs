const config = require("../config/config");
const constants = require("../utils/constants");
const validateSchema = require("../utils/schemaValidation");
const utils = require("../utils/utils");
const _ = require("lodash");

const checkContext = (data, path) => {
  console.log(
    `Inside Context Validation Check....\n*** Validating context for ${path} ***`
  );

  if (!data) return;
  let errObj = {};

  //Transaction ID - UUID Validity check
  if (data.transaction_id) {
    const result = utils.uuidCheck(data.transaction_id);
    if (!result) {
      errObj.tId_err = "Transaction id is not a valid uuid";
    }
  }

  //Transaction ID != Message ID
  if (data.transaction_id === data.message_id) {
    errObj.id_err = "transaction_id and message id can't be same";
  }
  if (data.action != path) {
    errObj.action_err = `context.action should be ${path}`;
  }
  if (data.ttl && data.ttl != constants.RET_CONTEXT_TTL) {
    {
      errObj.ttl_err = `ttl = ${constants.RET_CONTEXT_TTL} as per the API Contract`;
    }
  }

  if (data.timestamp) {
    let date = data.timestamp;
    result = utils.timestampCheck(date);
    if (result && result.err === "FORMAT_ERR") {
      errObj.timestamp_err =
        "Timestamp not in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format";
    } else if (result && result.err === "INVLD_DT") {
      errObj.timestamp_err = "Timestamp should be in date-time format";
    }
  }

  if (_.isEmpty(errObj)) {
    const result = { valid: true, SUCCESS: "Context Valid" };
    console.log(result);
    return result;
  } else {
    const result = { valid: false, ERRORS: errObj };
    console.error(result);
    return result;
  }
};

module.exports = { checkContext };
