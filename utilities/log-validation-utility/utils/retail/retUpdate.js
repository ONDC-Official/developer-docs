const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkUpdate = (dirPath, msgIdSet) => {
  let updtObj = {};
  let itemsUpdt = {};

  try {
    let update = fs.readFileSync(dirPath + `/${constants.RET_UPDATE}.json`);
    update = JSON.parse(update);

    try {
      console.log(`Validating Schema for ${constants.RET_UPDATE} API`);
      const vs = validateSchema("retail", constants.RET_UPDATE, update);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(updtObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_UPDATE}`,
        error
      );
    }

    try {
      console.log(`Checking context for /${constants.RET_UPDATE} API`); //checking context
      res = checkContext(update.context, constants.RET_UPDATE);
      if (!res.valid) {
        Object.assign(updtObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_UPDATE} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_UPDATE}`
      );
      if (!_.isEqual(dao.getValue("city"), update.context.city)) {
        updtObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_UPDATE}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_UPDATE}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_UPDATE} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), update.context.timestamp)) {
        dao.setValue("updtTmpstmp", update.context.timestamp);
        updtObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_UPDATE} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_UPDATE} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_UPDATE}`
      );
      if (!_.isEqual(dao.getValue("txnId"), update.context.transaction_id)) {
        statObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_UPDATE} api`
      );
    }
    try {
      console.log(`Checking Message Id of /${constants.RET_UPDATE}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for ${constants.RET_SELECT} and /on_select api should be same";
      // }

      if (msgIdSet.has(update.context.message_id)) {
        updtObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", update.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.RET_UPDATE}`
      );
    }

    update = update.message.order;

    try {
      console.log(`Saving items update_type in /${constants.RET_UPDATE}`);
      update.items.forEach((item, i) => {
        if (item.hasOwnProperty("tags")) {
          if (
            item.tags.update_type === "return" ||
            item.tags.update_type === "cancel"
          ) {
            itemsUpdt[item.id] = [item.quantity.count, item.tags.update_type];
          } else {
            updtObj.updtTypeErr = `items[${i}].tags.update_type can't be ${item.tags.update_type}`;
          }
        }
      });
      dao.setValue("itemsUpdt", itemsUpdt);
    } catch (error) {
      console.log(
        `!!Error while saving items update_type in /${constants.RET_UPDATE}`,
        error
      );
    }

    dao.setValue("updtObj", updtObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_UPDATE} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_UPDATE} API`,
        err
      );
    }
  }
};

module.exports = checkUpdate;
