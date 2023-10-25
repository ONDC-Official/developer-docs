const onConfirmSchema = require("./on_confirm");
const onInitSchema = require("./on_init");
const onSearchSchema = require("./on_search");
const selectSchema = require("./select");
const onSelectSchema = require("./on_select");
const onUpdateSchema = require("./on_update");
const searchSchema = require("./search");
const initSchema = require("./init");
const masterSchema = require("./master");
const confirmSchema = require("./confirm");
const statusSchema = require("./status");
const updateSchema = require("./update");
const onStatusSchema = require("./on_status");

const fs = require("fs");
//const async = require("async");
const path = require("path");

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
  const Ajv = require("ajv");
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    strictRequired: false,
    strictTypes: false,
    $data: true,
  });
  const addFormats = require("ajv-formats");

  addFormats(ajv);
  require("ajv-errors")(ajv);
  let error_list = [];
  try {
    validate = ajv
      .addSchema(searchSchema)
      .addSchema(onSearchSchema)
      .addSchema(selectSchema)
      .addSchema(onSelectSchema)
      .addSchema(initSchema)
      .addSchema(onInitSchema)
      .addSchema(confirmSchema)
      .addSchema(onConfirmSchema)
      .addSchema(updateSchema)
      .addSchema(onUpdateSchema)
      .addSchema(statusSchema)
      .addSchema(onStatusSchema);

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

const validate_schema_b2b_master = (data) => {
  error_list = validate_schema(data, masterSchema);
  return formatted_error(error_list);
};

module.exports = {
  validate_schema_b2b_master,
};
