const { getVersion } = require("../utils/utils");
const {
  validate_schema_master,
} = require("./logistics_api_json_schema/SchemaValidator");
const {
  validate_schema_b2b_master,
} = require("./B2B_json_schema/schemaValidator");

const {
  validate_schema_srv_master,
} = require("./SRV_json_schema/schemaValidator");

const fs = require("fs");

const validate_schema_for_domain_json = (vertical, data, version) => {
  version = getVersion(data,vertical);
  switch (vertical) {
    case "logistics":
     
      res = validate_schema_master(data, version);
      return res;
    case "b2b":
      
      res = validate_schema_b2b_master(data,version);
      return res;
    case "services":
      res = validate_schema_srv_master(data,version);
      return res;
    default:
      console.log("Invalid Domain!!");
  }
};

module.exports = validate_schema_for_domain_json;
