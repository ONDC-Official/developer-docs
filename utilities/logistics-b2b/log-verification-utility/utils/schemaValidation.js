const schemaValidator = require("../schema/main");
const path = require("path");
const fs = require("fs");

const validateSchema = (domain, data, errObj) => {
  console.log(`Inside Schema Validation for domain: ${domain}`);

  const schmaVldtr = schemaValidator(domain,data);

  const datavld = schmaVldtr;
  // console.log("DATA validation", datavld)
  if (datavld.status === "fail") {
    let res = datavld.errors;
    let i = 0;
    const len = res.length;
    while (i < len) {
      let key = `schemaErr${i}`;
      errObj[key] = `${res[i].details} ${res[i].message}`;
      i++;
    }
    console.log(`Validating Schema completed`);
    return errObj;

  } else return "error";
};

module.exports = validateSchema;