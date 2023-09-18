const dao = require("../dao/dao");
const fs = require("fs");
const utils = require("./utils");
const constants = require("./constants");
const { checkMessage } = require("../services/service");
const validateSchema = require("./schemaValidation");
const path = require("path");
const checkContextVal = require("./ContextVal");

const Validate = (domain, dirPath, msgIdSet, ErrorObj) => {
  try {
    let log = fs.readFileSync(dirPath);
    log = JSON.parse(log);
    count = 0;

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
    Object.entries(log).forEach(([action, elements]) => {
      // Validate schema for each element in the array associated with the action
      elements.forEach((element, i) => {
        // Validating action context level checks
        try {
          if (!("Context" in ErrorObj)) ErrorObj["Context"] = {};
          CntxtObj = ErrorObj["Context"];
          //console.log(`Validating timestamp for ${action} api`);
          if (action != "search") {
            const ValCheck = checkContextVal(element, CntxtObj, msgIdSet);
            if (ValCheck != "error") {
              Object.assign(CntxtObj, ValCheck);
            }
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
          ErrorObj["Message"][`${action}_${i}`] = checkMessage(
            domain,
            element,
            action,
            msgIdSet,
            domain
          );
        } catch (error) {
          console.log(
            `!!Some error occurred while checking /${action} api message`,
            error
          );
        }
      });
    
      return ErrorObj;
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = Validate;