const {validate_schema_master}= require("../schema/logistics_api_json_schema/SchemaValidator");
const data = require("./test.json")

const errors=validate_schema_master(data)
console.log(errors);