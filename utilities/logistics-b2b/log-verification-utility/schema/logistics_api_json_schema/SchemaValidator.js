const onConfirmSchema = require("./onConfirmSchema");
const onInitSchema = require("./onInitSchema");
const onSearchSchema = require("./onSearchSchema");
const onTrackSchema = require("./onTrackSchema");
const onSupportSchema = require("./onSupportSchema");
const onStatusSchema = require("./onStatusSchema");
const onCancelSchema = require("./onCancelSchema");
const onUpdateSchema = require("./onUpdateSchema");
const searchSchema = require("./searchSchema");
const initSchema = require("./initSchema");
const masterSchema = require("./masterSchema");
const confirmSchema = require("./confirmSchema");
const statusSchema = require("./statusSchema");
const updateSchema = require("./updateSchema");
const cancelSchema = require("./cancelSchema");
const supportSchema = require("./supportSchema");
const trackSchema = require("./trackSchema");
const fs = require("fs");
//const async = require("async");
const path = require("path");

const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  strictRequired: false,
  strictTypes: false,
  verbose: true,
  $data: true,
});

const addFormats = require("ajv-formats");
//const masterSchemacopy = require("./masterSchemacopy");

addFormats(ajv);
require("ajv-errors")(ajv);

const formatted_error = (errors) => {
  error_list = [];
  let status = "";
  errors.forEach((error) => {
    error_dict = {
      message: `${error.message}${
        error.params.allowedValues ? ` (${error.params.allowedValues})` : ""
      }${error.params.allowedValue ? ` (${error.params.allowedValue})` : ""}${
        error.params.additionalProperty
          ? ` (${error.params.additionalProperty})`
          : ""
      }`,
      details: error.instancePath,
    };
    error_list.push(error_dict);
  });
  if (error_list.length === 0) status = "pass";
  else status = "fail";
  error_json = { errors: error_list, status: status };
  return error_json;
};

const validate_schema = (data, schema) => {
  let error_list = [];
  try {
    validate = ajv
      .addSchema(searchSchema)
      .addSchema(onSearchSchema)
      .addSchema(initSchema)
      .addSchema(onInitSchema)
      .addSchema(confirmSchema)
      .addSchema(onConfirmSchema)
      .addSchema(updateSchema)
      .addSchema(onUpdateSchema)
      .addSchema(statusSchema)
      .addSchema(onStatusSchema)
      .addSchema(supportSchema)
      .addSchema(onSupportSchema)
      .addSchema(trackSchema)
      .addSchema(onTrackSchema)
      .addSchema(cancelSchema)
      .addSchema(onCancelSchema);

    validate = validate.compile(schema);

    const valid = validate(data);
    if (!valid) {
      error_list = validate.errors;
    }
  } catch (error) {
    console.log("ERROR!! validating schema");
    console.trace(error);
  }

  return error_list;
};

const validate_schema_master = (data) => {
  error_list = validate_schema(data, masterSchema);
  return formatted_error(error_list);
};

module.exports = {
  validate_schema_master,
};