const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

//helper function to check /on_status and /on_update
checkPostConfirm = (msgPyld) => {};

module.exports = checkPostConfirm;
