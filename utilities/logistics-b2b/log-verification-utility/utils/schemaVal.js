const dao = require("../dao/dao");
const fs = require("fs");
const utils = require("./utils");
const constants = require("./constants");
const { checkMessage } = require("../services/service");
const validateSchema = require("./schemaValidation");
const path = require("path");
const checkContextVal = require("./ContextVal");

const Validate = async (domain, dirPath, msgIdSet, ErrorObj) => {
  try {
    let log = fs.readFileSync(dirPath);
    log = JSON.parse(log);

    // Validating Schema
    try {
      if (!("Schema" in ErrorObj)) ErrorObj["Schema"] = {};
      schemaObj = ErrorObj["Schema"];
      const vs = validateSchema(domain, log, schemaObj);
      console.log(vs);
      if (vs != "error") {
        Object.assign(schemaObj, vs);
      }
    } catch (error) {
      console.log(`!!Error occurred while performing schema validation`, error);
    }
    contextObj = ErrorObj["Context"];
    for (const [action, elements] of Object.entries(log)) {
      for (const [i, element] of elements.entries()) {
        // Validating action context level checks
        try {
          if (!("Context" in ErrorObj)) ErrorObj["Context"] = {};
          // CntxtObj = ErrorObj["Context"];
          //console.log(`Validating timestamp for ${action} api`);
          if (action != "search") {
            ErrorObj["Context"][`${action}_${i}`] = checkContextVal(
              element,
              msgIdSet,
              i
            );
            // if (ValCheck != "error") {
            //   Object.assign(CntxtObj, ValCheck);
            // }
          } else {
            dao.setValue("tmpstmp", element.context.timestamp);
          }
        } catch (error) {
          console.log(
            `!!Error occurred while performing ${action} timestamp validation`,
            error
          );
        }

        // Business validations
        try {
          if (!("Message" in ErrorObj)) ErrorObj["Message"] = {};
          ErrorObj["Message"][`${action}_${i}`] = await checkMessage(
            domain,
            element,
            action,
            msgIdSet
          );
        } catch (error) {
          console.log(
            `!!Some error occurred while checking /${action} api message`,
            error
          );
        }
      }
    }
    return ErrorObj;
  } catch (error) {
    console.log(error);
  }
};
module.exports = Validate;
