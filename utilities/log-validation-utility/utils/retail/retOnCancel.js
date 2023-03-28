const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkOnCancel = (dirPath, msgIdSet) => {
  let onCnclObj = {};

  try {
    var on_cancel = fs.readFileSync(
      dirPath + `/${constants.RET_ONCANCEL}.json`
    );

    on_cancel = JSON.parse(on_cancel);

    try {
      console.log(`Validating Schema for /${constants.RET_ONCANCEL} API`);
      const vs = validateSchema("retail", constants.RET_ONCANCEL, on_cancel);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(onCnclObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_ONCANCEL}`,
        error
      );
    }

    try {
      console.log(`Checking context for /${constants.RET_ONCANCEL} API`); //checking context
      res = checkContext(on_cancel.context, constants.RET_ONCANCEL);
      if (!res.valid) {
        Object.assign(onCnclObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONCANCEL} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONCANCEL}`
      );
      if (!_.isEqual(dao.getValue("city"), on_cancel.context.city)) {
        onCnclObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONCANCEL}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONCANCEL}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_ONCANCEL} and /${constants.RET_ONCONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_cancel.context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.RET_ONCONFIRM} api cannot be greater than or equal to /${constants.RET_ONCANCEL} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.RET_ONCONFIRM} and /${constants.RET_ONCANCEL} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL}`
      );
      if (_.gte(dao.getValue("cnclTmpstmp"), on_cancel.context.timestamp)) {
        onCnclObj.tmpstmp = `Timestamp for /${constants.RET_CANCEL} api cannot be greater than or equal to /${constants.RET_ONCANCEL} api`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONCANCEL}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_cancel.context.transaction_id)) {
        onCnclObj.txnId = `Transaction Id for /${constants.RET_SELECT} and /${constants.RET_ONCANCEL} api should be same`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONCANCEL} api`,
        error
      );
    }
    try {
      console.log(`Checking Message Id of /${constants.RET_ONCANCEL}`);
      if (!_.isEqual(dao.getValue("msgId"), on_cancel.context.message_id)) {
        onCnclObj.msgId = `Message Id for /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} api should be same`;
      }
      // if (msgIdSet.has(status.context.message_id)) {
      //   statObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = status.context.message_id;
      msgIdSet.add(on_cancel.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.RET_ONCANCEL}`,
        error
      );
    }
    on_cancel = on_cancel.message.order;

    try {
      console.log(
        `Comparing order id in /${constants.RET_ONCANCEL} and /${constants.RET_CONFIRM}`
      );
      if (on_cancel.id != dao.getValue("cnfrmOrdrId")) {
        onCnclObj.onCancelId = `Order id in /${constants.RET_ONCANCEL} and /${constants.RET_CONFIRM} do not match`;
        console.log(
          `Order id in /${constants.RET_ONCANCEL} and /${constants.RET_CONFIRM} do not match`
        );
      }
    } catch (error) {
      // onCnclObj.onCancelId =
      //   "Order id in /${constants.RET_ONCANCEL} and /${constants.RET_ONCONFIRM} do not match";
      console.log(
        `!!Error while comparing order id in /${constants.RET_ONCANCEL} and /${constants.RET_ONCONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing cancellation reason id in /${constants.RET_ONCANCEL} and /${constants.RET_CANCEL}`
      );
      if (dao.getValue("cnclRid") != on_cancel.tags.cancellation_reason_id) {
        onCnclObj.onCancelRID = `Cancellation Reason Id in /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} should be same`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing cancellation reason id in /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL}`,
        error
      );
      // onCnclObj.onCancelRID =
      //   "Cancellation reason Id in /${constants.RET_CANCEL} and /${constants.RET_ONCANCEL} (inside tags) should be same";
    }

    dao.setValue("onCnclObj", onCnclObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_ONCANCEL} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONCANCEL} API`,
        err
      );
    }
  }
};

module.exports = checkOnCancel;
