const fs = require("fs");
//const async = require("async");
const { isLengthValid } = require("./v1.2/keywords/init");
const { isQuoteMatching } = require("./v1.2/keywords/onInit");
const { isFutureDated } = require("./v1.2/keywords/confirm");
const { isEndTimeGreater } = require("./v1.2/keywords/search");

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
    return require(`./${version}/${schemaType}Schema.js`);
  } catch (error) {
    console.log("Error Occurred while importing", error);
  }
};

const validate_schema = (data, schema, version) => {
  const searchSchema = loadSchema("search", version);
  const onSearchSchema = loadSchema("onSearch", version);

  const initSchema = loadSchema("init", version);
  const onInitSchema = loadSchema("onInit", version);

  const confirmSchema = loadSchema("confirm", version);
  const onConfirmSchema = loadSchema("onConfirm", version);

  const updateSchema = loadSchema("update", version);
  const onUpdateSchema = loadSchema("onUpdate", version);

  const statusSchema = loadSchema("status", version);
  const onStatusSchema = loadSchema("onStatus", version);

  const supportSchema = loadSchema("support", version);
  const onSupportSchema = loadSchema("onSupport", version);

  const trackSchema = loadSchema("track", version);
  const onTrackSchema = loadSchema("onTrack", version);

  const cancelSchema = loadSchema("cancel", version);
  const onCancelSchema = loadSchema("onCancel", version);

  const commonSchemaV1_2 = require("./v1.2/common/commonSchema");

  const Ajv = require("ajv");
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    strictRequired: false,
    strictTypes: false,
    verbose: true,
    $data: true,
    schemaIs: "id",
  });

  const addFormats = require("ajv-formats");

  addFormats(ajv);
  require("ajv-errors")(ajv);
  require('ajv-merge-patch')(ajv);
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
      .addSchema(onCancelSchema)
      .addKeyword("isEndTimeGreater", {
        validate: (schema, data) => isEndTimeGreater(data),
      })
      .addSchema(commonSchemaV1_2)
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

const validate_schema_master = (data, version) => {
  const masterSchema = loadSchema("master", version);
  error_list = validate_schema(data, masterSchema, version);
  return formatted_error(error_list);
};

module.exports = {
  validate_schema_master,
};
