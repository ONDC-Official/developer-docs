
const { isLengthValid } = require("./keywords/init");
const { isQuoteMatching } = require("./keywords/onInit");
const { isFutureDated } = require("./keywords/confirm");
const { isEndTimeGreater } = require("./keywords/search");

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

const loadSchema = (schemaType, version) => {
  try {
    return require(`./${version}/${schemaType}.js`);
  } catch (error) {
    console.log("Error Occurred while importing", error);
  }
};

const validate_schema = (data, schema,version) => {
  const searchSchema = loadSchema("search", version);
  const onSearchSchema = loadSchema("on_search", version);

  const selectSchema = loadSchema("select", version);
  const onSelectSchema = loadSchema("on_select", version);

  const initSchema = loadSchema("init", version);
  const onInitSchema = loadSchema("on_init", version);

  const confirmSchema = loadSchema("confirm", version);
  const onConfirmSchema = loadSchema("on_confirm", version);

  const updateSchema = loadSchema("update", version);
  const onUpdateSchema = loadSchema("on_update", version);

  const statusSchema = loadSchema("status", version);
  const onStatusSchema = loadSchema("on_status", version);

  const cancelSchema = loadSchema("cancel", version);
  const onCancelSchema = loadSchema("on_cancel", version);

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
      .addSchema(onStatusSchema)
      .addSchema(cancelSchema)
      .addSchema(onCancelSchema)
      .addKeyword("isEndTimeGreater", {
        validate: (schema, data) => isEndTimeGreater(data),
      })
      .addKeyword("isQuoteMatching", {
        validate: (schema, data) => isQuoteMatching(data),
      })
      .addKeyword("isFutureDated", {
        validate: (schema, data) => isFutureDated(data),
      })
      .addKeyword("isLengthValid", {
        validate: (schema, data) => isLengthValid(data),
      });

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

const validate_schema_b2b_master = (data,version) => {
  const masterSchema = loadSchema("master", version);
  error_list = validate_schema(data, masterSchema,version);
  return formatted_error(error_list);
};

module.exports = {
  validate_schema_b2b_master,
};
