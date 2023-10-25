const checkConfirm = require("./logConfirm");
const checkInit = require("./logInit");
const checkOnConfirm = require("./logOnConfirm");
const checkOnInit = require("./logOnInit");
const checkOnSearch = require("./logOnSearch");
const checkOnUpdate = require("./logOnUpdate");
const checkUpdate = require("./logUpdate");
const checkOnStatus = require("./logOnStatus");
const checkOnCancel = require("./logOnCancel");
const checkSearch = require("./logSearch");
const _ = require("lodash");

const logisticsVal = async (element, action, msgIdSet) => {
  const busnsErr = {};
  switch (action) {
    case "search":
      return checkSearch(element, msgIdSet);

    case "on_search":
      return checkOnSearch(element, msgIdSet);

    case "init":
      return checkInit(element, msgIdSet);

    case "on_init":
      return checkOnInit(element, msgIdSet);

    case "confirm":
      return checkConfirm(element, msgIdSet);

    case "on_confirm":
      return checkOnConfirm(element, msgIdSet);

    case "update":
      return checkUpdate(element,msgIdSet);

    case "on_update":
      return checkOnUpdate(element,msgIdSet)

    case "on_status":
      return checkOnStatus(element,msgIdSet)

      case "on_cancel":
      return checkOnCancel(element,msgIdSet)
  }
  return busnsErr;
};
module.exports = { logisticsVal };