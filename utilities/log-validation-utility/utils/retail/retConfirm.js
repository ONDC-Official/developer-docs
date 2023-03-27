const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");

const checkConfirm = (dirPath, msgIdSet) => {
  let cnfrmObj = {};
  try {
    var confirm = fs.readFileSync(dirPath + `/${constants.RET_CONFIRM}.json`);
    confirm = JSON.parse(confirm);

    try {
      console.log(`Validating Schema for ${constants.RET_CONFIRM} API`);
      const vs = validateSchema("retail", constants.RET_CONFIRM, confirm);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(cnfrmObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(`Checking context for /${constants.RET_CONFIRM} API`); //checking context
      res = checkContext(confirm.context, constants.RET_CONFIRM);
      if (!res.valid) {
        Object.assign(cnfrmObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_CONFIRM} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_CONFIRM}`
      );
      if (!_.isEqual(dao.getValue("city"), confirm.context.city)) {
        cnfrmObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of /${constants.RET_ONINIT} and /${constants.RET_CONFIRM}`
      );
      if (_.gte(dao.getValue("tmpstmp"), confirm.context.timestamp)) {
        cnfrmObj.tmpstmp = `Timestamp for /${constants.RET_ONINIT} api cannot be greater than or equal to /${constants.RET_CONFIRM} api`;
      }
      dao.setValue("tmpstmp", confirm.context.timestamp);
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.RET_ONINIT} and /${constants.RET_CONFIRM} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_CONFIRM}`
      );
      if (!_.isEqual(dao.getValue("txnId"), confirm.context.transaction_id)) {
        cnfrmObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_CONFIRM} api`,
        error
      );
    }

    try {
      console.log(`Checking Message Id of /${constants.RET_CONFIRM}`);
      // if (!_.isEqual(msgId, on_init.context.message_id)) {
      //   onInitObj.msgId = "Message Ids for /init and /on_init api should be same";
      // }

      if (msgIdSet.has(confirm.context.message_id)) {
        cnfrmObj.msgId2 =
          "Message Id cannot be same for different sets of APIs";
      }
      dao.setValue("msgId", confirm.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.RET_CONFIRM}`,
        error
      );
    }

    confirm = confirm.message.order;

    const cnfrmOrdrId = confirm.id;
    dao.setValue("cnfrmOrdrId", cnfrmOrdrId);

    try {
      console.log(`Checking order state in /${constants.RET_CONFIRM}`);
      if (confirm.state.toLowerCase() != "created") {
        cnfrmObj.state = `Default order state should be used in /${constants.RET_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking order state in /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Checking provider id and location in /${constants.RET_CONFIRM}`
      );
      if (confirm.provider.id != dao.getValue("providerId")) {
        cnfrmObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_CONFIRM}`;
      }

      if (confirm.provider.locations[0].id != dao.getValue("providerLoc")) {
        cnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking provider id and location in /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing item Ids and fulfillment ids in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
      );
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      const itemsIdList = dao.getValue("itemsIdList");
      let i = 0;
      const len = confirm.items.length;
      while (i < len) {
        let itemId = confirm.items[i].id;
        if (itemId in itemFlfllmnts) {
          if (confirm.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            let itemkey = `item_FFErr${i}`;
            cnfrmObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`;
          }
        } else {
          let itemkey = `item_FFErr${i}`;
          cnfrmObj[
            itemkey
          ] = `Item Id ${itemId} does not exist in /${constants.RET_ONSELECT}`;
        }

        if (itemId in itemsIdList) {
          if (confirm.items[i].quantity.count != itemsIdList[itemId]) {
            cnfrmObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`;
          }
        }
        i++;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing billing object in /${constants.RET_INIT} and /${constants.RET_CONFIRM}`
      );
      const billing = dao.getValue("billing");
      if (!_.isEqual(billing, confirm.billing)) {
        cnfrmObj.bill = `Billing object mismatches in /${constants.RET_INIT} and /${constants.RET_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing billing object in /${constants.RET_INIT} and /${constants.RET_CONFIRM}`
      );
    }

    try {
      console.log(`Checking fulfillments objects in /${constants.RET_CONFIRM}`);
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      let i = 0;
      const len = confirm.fulfillments.length;
      while (i < len) {
        //Comparing fulfillment Ids
        if (confirm.fulfillments[i].id) {
          let id = confirm.fulfillments[i].id;
          if (!Object.values(itemFlfllmnts).includes(id)) {
            key = `ffID${id}`;
            //MM->Mismatch
            cnfrmObj[
              key
            ] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`;
          }
        } else {
          cnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.RET_CONFIRM}`;
        }

        if (
          !confirm.fulfillments[i].end ||
          !confirm.fulfillments[i].end.person
        ) {
          cnfrmObj.ffprsn = `fulfillments[${i}].end.person object is missing`;
        }

        if (
          !_.isEqual(
            confirm.fulfillments[i].end.location.gps,
            dao.getValue("buyerGps")
          )
        ) {
          cnfrmObj.gpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`;
        }

        if (
          !_.isEqual(
            confirm.fulfillments[i].end.location.address.area_code,
            dao.getValue("buyerAddr")
          )
        ) {
          cnfrmObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`;
        }

        i++;
      }
    } catch (error) {
      console.log(
        `!!Error while checking fulfillments object in /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(`Checking payment object in /${constants.RET_CONFIRM}`);
      // if (dao.getValue("paymentType") === "ON-ORDER") {
      if (confirm.payment.status != "PAID") {
        cnfrmObj.pymntEr = `payment.status should be "PAID" in case of pre-paid order(ON-ORDER)`;
      } else if (
        !confirm.payment.params ||
        !confirm.payment.params.transaction_id
      ) {
        cnfrmObj.pymntErrr = `payment.params.transaction_id is missing when status is PAID`;
      }

      if (confirm.payment.type != "ON-ORDER") {
        cnfrmObj.pymnttype = `payment.type is expected to be ON-ORDER`;
      }

      if (confirm.payment.collected_by != `BAP`) {
        cnfrmObj.pymntcollected = `payment.collected_by is expected to be BAP`;
      }

      // if (!confirm.payment.uri)
      //   cnfrmObj.uri = `payment.uri is mandatory in /confirm`;

      // if (!confirm.payment.tl_method)
      //   cnfrmObj.tlmthd = `payment.tl_method is mandatory in /confirm`;

      if (
        parseFloat(confirm.payment.params.amount) !=
        parseFloat(confirm.quote.price.value)
      ) {
        cnfrmObj.confirmedAmount =
          "Quoted price (/confirm) doesn't match with the amount in payment.params";
      }

      if (
        !_.isEqual(
          confirm.payment["@ondc/org/settlement_details"][0],
          dao.getValue("sttlmntdtls")
        )
      ) {
        cnfrmObj.sttlmntdtls = `payment settlement_details mismatch in /${constants.RET_ONINIT} & /${constants.RET_CONFIRM}`;
      }

      if (
        !confirm.hasOwnProperty("created_at") ||
        !confirm.hasOwnProperty("updated_at")
      ) {
        cnfrmObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.RET_CONFIRM}`;
      } else {
        if (!_.isEqual(confirm.created_at, dao.getValue("tmpstmp"))) {
          cnfrmObj.orderCrtd = `order.created_at timestamp should match context.timestamp`;
        } else {
          dao.setValue("ordrcrtdtmpstmp", confirm.created_at);
        }

        if (!_.isEqual(confirm.created_at, confirm.updated_at)) {
          cnfrmObj.ordrupdtd = `order.updated_at timestamp should match order.created_at timestamp`;
        } else {
          dao.setValue("ordrupdtdtmpstmp", confirm.updated_at);
        }
      }
    } catch (error) {
      console.log(
        `!!Error while checking payment object in /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(`storing payment object in /${constants.RET_CONFIRM}`);
      dao.setValue("cnfrmpymnt", confirm.payment);
    } catch (error) {
      console.log(
        `!!Error while storing payment object in /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log(
        `Comparing Quote object for /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
      );
      console.log("confirm quote", confirm.quote);
      if (!_.isEqual(dao.getValue("quoteObj"), confirm.quote)) {
        cnfrmObj.quoteObj = `Discrepancies between the quote object in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`;
      }
    } catch (error) {
      console.log(
        `!!Error while Comparing Quote object for /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
      );
      // cnfrmObj.quoteObj = "Quote Object in /on_select and /confirm mismatch";
    }

    try {
      console.log(
        `Checking Buyer App finder fee amount in /${constants.RET_CONFIRM}`
      );
      const buyerFF = dao.getValue("buyerFF");
      if (
        !confirm.payment["@ondc/org/buyer_app_finder_fee_amount"] ||
        parseFloat(confirm.payment["@ondc/org/buyer_app_finder_fee_amount"]) !=
          buyerFF
      ) {
        cnfrmObj.bapFinderFee = `Buyer App Finder fee can't change`;
        console.log(
          `Buyer app finder fee ${confirm.payment["@ondc/org/buyer_app_finder_fee_amount"]} can't change in /${constants.RET_CONFIRM}`
        );
      }
    } catch (error) {
      console.log(
        `!!Error while Checking Buyer App finder fee amount in /${constants.RET_CONFIRM}`,
        error
      );
    }

    try {
      console.log("storing order created and updated timestamps");
      if (confirm.created_at) dao.setValue("ordrCrtd", confirm.created_at);

      if (confirm.updated_at) dao.setValue("ordrUpdtd", confirm.updated_at);
    } catch (error) {
      console.log(
        `!!Error while storing order created and updated timestamps in /${constants.RET_CONFIRM}`
      );
    }

    try {
      console.log(
        `Comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
      );
      const onSelectPrice = dao.getValue("onSelectPrice");
      const confirmQuotePrice = parseFloat(confirm.quote.price.value);
      if (onSelectPrice != confirmQuotePrice) {
        console.log(
          `order quote price in /${constants.RET_CONFIRM} is not equal to the quoted price in /${constants.RET_ONSELECT}`
        );
        cnfrmObj.quoteErr = `Quoted Price in /${constants.RET_CONFIRM} INR ${confirmQuotePrice} does not match with the quoted price in /${constants.RET_ONSELECT} INR ${onSelectPrice}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}`
      );
    }

    // try {
    //   console.log(
    //     `Checking and Storing buyer's T&C in /${constants.RET_CONFIRM}`
    //   );
    //   if (confirm.hasOwnProperty("tags")) {
    //     dao.setValue("buyerT&C", confirm.tags);
    //   }
    // } catch (error) {
    //   console.log(
    //     `!!Error while checking and storing buyer's T&C in /${constants.RET_CONFIRM}`,
    //     error
    //   );
    // }

    dao.setValue("cnfrmObj", cnfrmObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_CONFIRM} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_CONFIRM} API`,
        err
      );
    }
  }
};

module.exports = checkConfirm;
