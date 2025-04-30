const schemaValidator = require("./retail_api_json_schema/SchemaValidator");

const fs = require("fs");

const validate_schema_for_retail_json = (vertical, api, data) => {
  res = schemaValidator[`validate_schema_${api}_${vertical}_for_json`](data);
  return res;
};

module.exports = validate_schema_for_retail_json;
