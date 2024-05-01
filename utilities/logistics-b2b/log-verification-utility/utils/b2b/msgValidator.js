const checkConfirm = require("./b2bConfirm");
const checkInit = require("./b2bInit");
const checkSelect = require("./b2bSelect");
const checkOnInit = require("./b2bOnInit");
const checkOnConfirm = require("./b2bOnConfirm");
const checkCancel = require("./b2bCancel");
const checkOnCancel = require("./b2bonCancel");
const checkOnSelect = require("./b2bOnSelect");
const checkOnSearch = require("./b2bOnSearch");
const checkOnUpdate = require("./b2bOnUpdate");
const checkUpdate = require("./b2bUpdate");
const checkOnStatus = require("./b2bOnStatus");
const checkSearch = require("./b2bSearch");
const _ = require("lodash");

const b2bVal = (element, action, msgIdSet) => {
  const busnsErr = {};
  switch (action) {
    case "search":
      return checkSearch(element, msgIdSet);

    case "on_search":
      return checkOnSearch(element, msgIdSet);

    case "select":
      return checkSelect(element, msgIdSet);

    case "on_select":
      return checkOnSelect(element, msgIdSet);

    case "init":
      return checkInit(element, msgIdSet);

    case "on_init":
      return checkOnInit(element, msgIdSet);

    case "confirm":
      return checkConfirm(element, msgIdSet);

    case "on_confirm":
      return checkOnConfirm(element, msgIdSet);

    case "on_cancel":
      return checkOnCancel(element, msgIdSet);

    case "cancel":
      return checkCancel(element, msgIdSet);

    // case "update":
    //   return checkUpdate(element,msgIdSet);

    // case "on_update":
    //   return checkOnUpdate(element,msgIdSet)

    case "on_status":
      return checkOnStatus(element, msgIdSet);
  }
  return busnsErr;
};
module.exports = { b2bVal };
