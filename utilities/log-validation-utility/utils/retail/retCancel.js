const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const utils = require("../utils");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkCancel = (dirPath, msgIdSet) => {
  let cnclObj = {};
  try {
    var cancel = fs.readFileSync(dirPath + `/${constants.RET_CANCEL}.json`);
    cancel = JSON.parse(cancel);

    try {
      console.log(`Validating Schema for ${constants.RET_CANCEL} API`);
      const vs = validateSchema("retail", constants.RET_CANCEL, cancel);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(cnclObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_CANCEL}`,
        error
      );
    }

    console.log(`Checking context for /${constants.RET_CANCEL} API`); //checking context
    try {
      res = checkContext(cancel.context, constants.RET_CANCEL);
      if (!res.valid) {
        Object.assign(cnclObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_CANCEL} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SELECT} and /${constants.RET_CANCEL}`
      );
      if (!_.isEqual(dao.getValue("city"), cancel.context.city)) {
        cnclObj.city = `City code mismatch in /${constants.RET_SELECT} and /${constants.RET_CANCEL}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SELECT} and /${constants.RET_CANCEL}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_CANCEL} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), cancel.context.timestamp)) {
        dao.setValue("cnclTmpstmp", cancel.context.timestamp);
        cnclObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_CANCEL} api`;
      }
    } catch (error) {
      console.log(
        `Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_CANCEL} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_CANCEL}`
      );
      if (!_.isEqual(dao.getValue("txnId"), cancel.context.transaction_id)) {
        cnclObj.txnId = `Transaction Id for /${constants.RET_SELECT} and /${constants.RET_CANCEL} api should be same`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_CANCEL} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.RET_CANCEL}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /select and /on_select api should be same";
      // }

      if (msgIdSet.has(cancel.context.message_id)) {
        cnclObj.msgId2 = `Message Id cannot be same for different sets of APIs`;
      }
      dao.setValue("msgId", cancel.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.RET_CANCEL}`,
        error
      );
    }

    cancel = cancel.message;

    try {
      console.log(
        `Comparing order Id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`
      );
      if (cancel.order_id != dao.getValue("cnfrmOrdrId")) {
        cnclObj.cancelOrdrId = `Order Id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM} do not match`;
        console.log(
          `Order Id mismatch in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`
        );
      }
    } catch (error) {
      console.log(
        `Error while comparing order id in /${constants.RET_CANCEL} and /${constants.RET_CONFIRM}`,
        error
      );
      // cnclObj.cancelOrdrId =
      //   "Order Id in /${constants.RET_CANCEL} and /${constants.RET_ONCONFIRM} do not match";
    }

    try {
      console.log("Checking the validity of cancellation reason id");
      if (!(cancel.cancellation_reason_id in utils.cancellation_rid)) {
        console.log(
          `Cancellation Reason Id in /${constants.RET_CANCEL} is not a valid reason id`
        );

        cnclObj.cancelRid = `Cancellation reason id in /${constants.RET_CANCEL} is not a valid reason id`;
      } else dao.setValue("cnclRid", cancel.cancellation_reason_id);
    } catch (error) {
      // cnclObj.cancelRid =
      //   "Cancellation reason id in /${constants.RET_CANCEL} is not a valid reason id";
      console.log(
        `Error while checking validity of cancellation reason id /${constants.RET_CANCEL}`,
        error
      );
    }
    dao.setValue("cnclObj", cnclObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_CANCEL} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_CANCEL} API`,
        err
      );
    }
  }
};

module.exports = checkCancel;
