const schemaValidator = require("../schema/main");
const path = require("path");
const fs = require("fs");
const logger = require("./logger");

const validateSchema = (domain, api, data) => {
  logger.info(`Inside Schema Validation for domain: ${domain}, api: ${api}`);
  let errObj = {};

  const schmaVldtr = schemaValidator(domain, api, data);

  const datavld = schmaVldtr;
  if (datavld.status === "fail") {
    let res = datavld.errors;
    // res = res.map(({ type, ...rest }) => ({ ...rest }));
    let i = 0;
    const len = res.length;
    while (i < len) {
      let key = `schemaErr${i}`;
      errObj[key] = `${res[i].details} ${res[i].message}`;
      i++;
    }
    return errObj;
  } else return "error";
};

module.exports = validateSchema;
