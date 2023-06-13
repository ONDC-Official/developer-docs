const onConfirmSchema = require("./onConfirmSchema");
const onInitSchema = require("./onInitSchema");
const onSearchSchema = require("./onSearchSchema");
const onSelectSchema = require("./onSelectSchema");
const onTrackSchema = require("./onTrackSchema");
const onSupportSchema = require("./onSupportSchema");
const onStatusSchema = require("./onStatusSchema");
const onCancelSchema = require("./onCancelSchema");
const onUpdateSchema = require("./onUpdateSchema");
const searchSchema = require("./searchSchema");
const selectSchema = require("./selectSchema");
const initSchema = require("./initSchema");
const confirmSchema = require("./confirmSchema");
const statusSchema = require("./statusSchema");
const updateSchema = require("./updateSchema");
const cancelSchema = require("./cancelSchema");

const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  strict: "log",
});
const addFormats = require("ajv-formats");
addFormats(ajv);
require("ajv-errors")(ajv);

const formatted_error = (errors) => {
  error_list = [];
  let status = "";
  errors.forEach((error) => {
    if (
      !["not", "oneOf", "anyOf", "allOf", "if", "then", "else"].includes(
        error.keyword
      )
    ) {
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
    }
  });
  if (error_list.length === 0) status = "pass";
  else status = "fail";
  error_json = { errors: error_list, status: status };
  return error_json;
};

const validate_schema = (data, schema) => {
  let error_list = [];
  validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    error_list = validate.errors;
  }
  return error_list;
};

const validate_schema_search_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = searchSchema));
  return formatted_error(error_list);
};

const validate_schema_on_search_retail_for_json = (data) => {
  // transformed_item_data = transform_on_search_schema(data);
  error_list = validate_schema(data, (schema = onSearchSchema));
  return formatted_error(error_list);
};

const validate_schema_select_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = selectSchema));
  return formatted_error(error_list);
};

const validate_schema_on_select_retail_for_json = (data) => {
  item_data = data["message"]["order"];
  error_list = validate_schema(item_data, (schema = onSelectSchema));
  return formatted_error(error_list);
};

const validate_schema_init_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = initSchema));
  return formatted_error(error_list);
};

const validate_schema_on_init_retail_for_json = (data) => {
  item_data = data["message"]["order"];
  error_list = validate_schema(item_data, (schema = onInitSchema));
  return formatted_error(error_list);
};

const validate_schema_confirm_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = confirmSchema));
  return formatted_error(error_list);
};

const validate_schema_on_confirm_retail_for_json = (data) => {
  item_data = data["message"]["order"];
  error_list = validate_schema(item_data, (schema = onConfirmSchema));
  return formatted_error(error_list);
};

const validate_schema_status_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = statusSchema));
  return formatted_error(error_list);
};

const validate_schema_on_status_retail_for_json = (data) => {
  item_data = data["message"]["order"];
  error_list = validate_schema(item_data, (schema = onStatusSchema));
  return formatted_error(error_list);
};

const validate_schema_cancel_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = cancelSchema));
  return formatted_error(error_list);
};

const validate_schema_on_cancel_retail_for_json = (data) => {
  item_data = data["message"]["order"];
  error_list = validate_schema(item_data, (schema = onCancelSchema));
  return formatted_error(error_list);
};

const validate_schema_update_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = updateSchema));
  return formatted_error(error_list);
};

const validate_schema_on_update_retail_for_json = (data) => {
  item_data = data["message"]["order"];
  error_list = validate_schema(item_data, (schema = onUpdateSchema));
  return formatted_error(error_list);
};

const validate_schema_track_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = trackSchema));
  return formatted_error(error_list);
};

const validate_schema_on_track_retail_for_json = (data) => {
  item_data = data["message"];
  error_list = validate_schema(item_data, (schema = onTrackSchema));
  return formatted_error(error_list);
};

const validate_schema_support_retail_for_json = (data) => {
  error_list = validate_schema(data, (schema = supportSchema));
  return formatted_error(error_list);
};

const validate_schema_on_support_retail_for_json = (data) => {
  item_data = data["message"];
  error_list = validate_schema(item_data, (schema = onSupportSchema));
  return formatted_error(error_list);
};

module.exports = {
  validate_schema_search_retail_for_json,
  validate_schema_select_retail_for_json,
  validate_schema_init_retail_for_json,
  validate_schema_confirm_retail_for_json,
  validate_schema_update_retail_for_json,
  validate_schema_status_retail_for_json,
  validate_schema_track_retail_for_json,
  validate_schema_cancel_retail_for_json,
  validate_schema_support_retail_for_json,
  validate_schema_on_cancel_retail_for_json,
  validate_schema_on_confirm_retail_for_json,
  validate_schema_on_init_retail_for_json,
  validate_schema_on_search_retail_for_json,
  validate_schema_on_select_retail_for_json,
  validate_schema_on_status_retail_for_json,
  validate_schema_on_support_retail_for_json,
  validate_schema_on_track_retail_for_json,
  validate_schema_on_update_retail_for_json,
};
