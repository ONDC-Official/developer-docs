const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const validateSchema = require("../schemaValidation");
const utils = require("../utils");
const constants = require("../constants");
const logger = require("../logger");

const checkOnConfirm = (dirPath, msgIdSet) => {
  let onCnfrmObj = {};

  try {
    var on_confirm = fs.readFileSync(
      dirPath + `/${constants.RET_ONCONFIRM}.json`
    );
    on_confirm = JSON.parse(on_confirm);

    try {
      logger.info(`Validating Schema for /${constants.RET_ONCONFIRM} API`);
      const vs = validateSchema("retail", constants.RET_ONCONFIRM, on_confirm);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(onCnfrmObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking context for /${constants.RET_ONCONFIRM} API`); //checking context
      res = checkContext(on_confirm.context, constants.RET_ONCONFIRM);
      if (!res.valid) {
        Object.assign(onCnfrmObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONCONFIRM} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_ONCONFIRM}`
      );
      if (!_.isEqual(dao.getValue("city"), on_confirm.context.city)) {
        onCnfrmObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_ONCONFIRM}`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
      );
      const tmpstmp = dao.getValue("tmpstmp");
      if (_.gte(tmpstmp, on_confirm.context.timestamp)) {
        onCnfrmObj.tmpstmp = `Timestamp for /${constants.RET_CONFIRM} api cannot be greater than or equal to /${constants.RET_ONCONFIRM} api`;
      } else {
        const timeDiff = utils.timeDiff(on_confirm.context.timestamp, tmpstmp);
        logger.info(timeDiff);
        if (timeDiff > 5000) {
          onCnfrmObj.tmpstmp = `context/timestamp difference between /${constants.RET_ONCONFIRM} and /${constants.RET_CONFIRM} should be smaller than 5 sec`;
        }
      }

      dao.setValue("tmpstmp", on_confirm.context.timestamp);
    } catch (error) {
      logger.info(
        `Error while comparing timestamp for /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_ONCONFIRM}`
      );
      if (
        !_.isEqual(dao.getValue("txnId"), on_confirm.context.transaction_id)
      ) {
        onCnfrmObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_ONCONFIRM} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing Message Ids of /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_confirm.context.message_id)) {
        onCnfrmObj.msgId = `Message Ids for /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM} apis should be same`;
      }
      // if (msgIdSet.has(confirm.context.message_id)) {
      //   cnfrmObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = confirm.context.message_id;
      msgIdSet.add(on_confirm.context.message_id);
    } catch (error) {
      logger.info(
        `Error while checking message id for /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    on_confirm = on_confirm.message.order;

    try {
      logger.info(
        `Comparing order ids in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
      );
      if (dao.getValue("cnfrmOrdrId") != on_confirm.id) {
        onCnfrmObj.orderID = `Order Id mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while trying to fetch order ids in /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }
    try {
      logger.info(
        `checking created_at and updated_at timestamp in /${constants.RET_ONCONFIRM}`
      );
      const cnfrmOrdrCrtd = dao.getValue("ordrCrtd");
      const cnfrmOrdrUpdtd = dao.getValue("ordrUpdtd");
      if (on_confirm.state === "Created" || on_confirm.state === "Accepted") {
        if (
          cnfrmOrdrCrtd &&
          (!on_confirm.created_at || on_confirm.created_at != cnfrmOrdrCrtd)
        ) {
          onCnfrmObj.crtdtmstmp = `order.created_at timestamp mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`;
        }

        if (
          cnfrmOrdrUpdtd &&
          (!on_confirm.updated_at ||
            _.gte(cnfrmOrdrUpdtd, on_confirm.updated_at) ||
            on_confirm.updated_at != dao.getValue("tmpstmp"))
        ) {
          onCnfrmObj.updtdtmstmp = `order.updated_at timestamp should be updated as per the context.timestamp (since default fulfillment state is added)`;
        }
      }
    } catch (error) {
      logger.error(
        `!!Error while checking order timestamps in /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    // dao.setValue("onCnfrmOrdrId", on_confirm.id);

    try {
      logger.info(
        `Checking provider id and location in /${constants.RET_ONCONFIRM}`
      );
      if (on_confirm.provider.id != dao.getValue("providerId")) {
        onCnfrmObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONCONFIRM}`;
      }

      if (on_confirm.provider.locations[0].id != dao.getValue("providerLoc")) {
        onCnfrmObj.prvdrLoc = `provider.locations[0].id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONCONFIRM}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking provider id and location in /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      //checking provider location and name in /fulfillments/start
    } catch (error) {}

    try {
      logger.info(
        `Comparing item Ids and fulfillment ids in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`
      );
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      const itemsIdList = dao.getValue("itemsIdList");
      let i = 0;
      const len = on_confirm.items.length;
      while (i < len) {
        let itemId = on_confirm.items[i].id;
        if (itemId in itemFlfllmnts) {
          if (on_confirm.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            let itemkey = `item_FFErr${i}`;
            onCnfrmObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`;
          }
        } else {
          let itemkey = `item_FFErr${i}`;
          onCnfrmObj[
            itemkey
          ] = `Item Id ${itemId} does not exist in /${constants.RET_ONSELECT}`;
        }

        if (itemId in itemsIdList) {
          if (on_confirm.items[i].quantity.count != itemsIdList[itemId]) {
            onCnfrmObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`;
          }
        }
        i++;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_CONFIRM}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing billing object in ${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
      );
      const billing = dao.getValue("billing");
      if (utils.isObjectEqual(billing, on_confirm.billing).length>0) {
        const billingMismatch= utils.isObjectEqual(billing, on_confirm.billing);
        onCnfrmObj.bill = `${billingMismatch.join(", ")} mismatches in /billing in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`;
      }
      // dao.setValue("billing", on_confirm.billing);
    } catch (error) {
      logger.info(
        `!Error while comparing billing object in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
      );
    }

    // try {
    //   logger.info("Comparing count of items in /${constants.RET_SELECT} and /${constants.RET_ONCONFIRM}");
    //   const itemsIdList = dao.getValue("itemsIdList");
    //   on_confirm.items.forEach((item) => {
    //     if (item["id"] in itemsIdList) {
    //       if (itemsIdList[item["id"]] != item["quantity"].count) {
    //         onCnfrmObj.countErr = `Count of item ${item["id"]} in /${constants.RET_ONCONFIRM} does not match with the count in /${constants.RET_SELECT}`;
    //       }
    //     }
    //   });
    // } catch (error) {
    //   //   onCnfrmObj.countErr = `Count of item in /${constants.RET_ONCONFIRM} does not match with the count in /${constants.RET_SELECT}`;
    //   logger.info(
    //     "!!Error while comparing count items in /${constants.RET_ONCONFIRM} and /${constants.RET_SELECT}",
    //     error
    //   );
    // }

    try {
      logger.info(
        `Checking fulfillments objects in /${constants.RET_ONCONFIRM}`
      );
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      let i = 0;
      const len = on_confirm.fulfillments.length;
      while (i < len) {
        //Comparing fulfillment Ids
        if (on_confirm.fulfillments[i].id) {
          let id = on_confirm.fulfillments[i].id;
          if (!Object.values(itemFlfllmnts).includes(id)) {
            key = `ffID${id}`;
            //MM->Mismatch
            onCnfrmObj[
              key
            ] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`;
          }
        } else {
          onCnfrmObj.ffId = `fulfillments[${i}].id is missing in /${constants.RET_ONCONFIRM}`;
        }

        logger.info("Checking the fulfillments state");

        const ffDesc = on_confirm.fulfillments[i].state.descriptor;

        const ffStateCheck = ffDesc.hasOwnProperty("code")
          ? ffDesc.code === "Pending"
          : false;

        if (!ffStateCheck) {
          let key = `ffState${i}`;
          onCnfrmObj[
            key
          ] = `default fulfillments state is missing in /${constants.RET_ONCONFIRM}`;
        }

        if (
          !on_confirm.fulfillments[i].start ||
          !on_confirm.fulfillments[i].end
        ) {
          onCnfrmObj.ffstartend = `fulfillments[${i}] start and end locations are mandatory`;
        }
        try {
          if (
            !utils.compareCoordinates(
              on_confirm.fulfillments[i].start.location.gps,
              dao.getValue("providerGps")
            )
          ) {
            onCnfrmObj.sellerGpsErr = `store gps location /fulfillments[${i}]/start/location/gps can't change`;
          }
        } catch (error) {
          logger.error(
            `!!Error while checking store location in /${constants.RET_ONCONFIRM}`
          );
        }

        try {
          if (
            !_.isEqual(
              on_confirm.fulfillments[i].start.location.descriptor.name,
              dao.getValue("providerName")
            )
          ) {
            onCnfrmObj.sellerNameErr = `store name  /fulfillments[${i}]/start/location/descriptor/name can't change`;
          }
        } catch (error) {
          logger.error(
            `!!Error while checking store name in /${constants.RET_ONCONFIRM}`
          );
        }

        if (
          !_.isEqual(
            on_confirm.fulfillments[i].end.location.gps,
            dao.getValue("buyerGps")
          )
        ) {
          onCnfrmObj.buyerGpsErr = `fulfillments[${i}].end.location gps is not matching with gps in /select`;
        }

        if (
          !_.isEqual(
            on_confirm.fulfillments[i].end.location.address.area_code,
            dao.getValue("buyerAddr")
          )
        ) {
          onCnfrmObj.gpsErr = `fulfillments[${i}].end.location.address.area_code is not matching with area_code in /select`;
        }

        i++;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking fulfillments object in /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing /${constants.RET_ONCONFIRM} quoted Price and Payment Params amount`
      );
      if (
        parseFloat(on_confirm.payment.params.amount) !=
        parseFloat(on_confirm.quote.price.value)
      ) {
        onCnfrmObj.onConfirmedAmount = `Quoted price (/${constants.RET_ONCONFIRM}) doesn't match with the amount in payment.params`;
      }
    } catch (error) {
      logger.error(
        `!!Error while Comparing /${constants.RET_ONCONFIRM} quoted Price and Payment Params amount, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing Quote object for /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`
      );
      if (!_.isEqual(dao.getValue("quoteObj"), on_confirm.quote)) {
        onCnfrmObj.onQuoteObj = `Discrepancies between the quote object /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`;
      }
    } catch (error) {
      // onCnfrmObj.onQuoteObj = `Quote Object in /on_init and /${constants.RET_ONCONFIRM} mismatch`;
      logger.error(
        `!!Error while comparing quote in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`
      );
    }

    try {
      logger.info(
        `Comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}`
      );
      const onSelectPrice = dao.getValue("onSelectPrice");
      const onConfirmQuotePrice = parseFloat(on_confirm.quote.price.value);
      if (onSelectPrice != onConfirmQuotePrice) {
        logger.info(
          `order quote price in /${constants.RET_ONCONFIRM} is not equal to the quoted price in /${constants.RET_ONSELECT}`
        );
        onCnfrmObj.quoteErr = `Quoted Price in /${constants.RET_ONCONFIRM} ${onConfirmQuotePrice} does not match with the quoted price in /${constants.RET_ONSELECT} ${onSelectPrice}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing order price value in /${constants.RET_ONSELECT} and /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing payment object in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`
      );

      if (!_.isEqual(dao.getValue("cnfrmpymnt"), on_confirm.payment)) {
        onCnfrmObj.pymntObj = `payment object mismatches in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing payment object in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Checking Buyer App finder fee amount in /${constants.RET_ONCONFIRM}`
      );
      const buyerFF = dao.getValue("buyerFF");
      if (
        on_confirm.payment["@ondc/org/buyer_app_finder_fee_amount"] &&
        parseFloat(
          on_confirm.payment["@ondc/org/buyer_app_finder_fee_amount"]
        ) != buyerFF
      ) {
        onCnfrmObj.buyerFF = `Buyer app finder fee can't change in /${constants.RET_ONCONFIRM}`;
        logger.info(
          `Buyer app finder fee can't change in /${constants.RET_ONCONFIRM}`
        );
      }
    } catch (error) {
      logger.info(
        `!Error while comparing buyer app finder fee in /${constants.RET_ONCONFIRM}, ${error.stack}`
      );
    }

    // try {
    //   logger.info(
    //     `comparing created and updated order timestamps in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`
    //   );

    //   if (
    //     !on_confirm.hasOwnProperty("created_at") ||
    //     !on_confirm.hasOwnProperty("updated_at")
    //   ) {
    //     onCnfrmObj.ordertmpstmp = `order created and updated timestamps are mandatory in /${constants.RET_ONCONFIRM}`;
    //   } else {
    //     const confirmTmpStmp = dao.getValue("ordrcrtdtmpstmp");
    //     if (
    //       confirmTmpStmp &&
    //       !_.isEqual(on_confirm.created_at, confirmTmpStmp)
    //     ) {
    //       onCnfrmObj.orderCrtd = `order.created_at timestamp should be the same in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`;
    //     }
    //     const confirmUpdtTmpStmp = dao.getValue("ordrupdtdtmpstmp");
    //     if (
    //       confirmUpdtTmpStmp &&
    //       !_.isEqual(on_confirm.updated_at, confirmUpdtTmpStmp)
    //     ) {
    //       onCnfrmObj.ordrupdtd = `order.updated_at timestamp should be same in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`;
    //     }
    //   }
    // } catch (error) {
    //   logger.info(
    //     `!!Error while comparing created and updated timestamps in /${constants.RET_CONFIRM} & /${constants.RET_ONCONFIRM}`
    //   );
    // }
    //TNC ARRAY OF OBJECTS DEEP COMPARISON WITH LODASH
    // try {
    //   logger.info(
    //     `Comparing buyer's T&C in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`
    //   );
    //   const buyerTnc = dao.getValue("buyerT&C");

    //   if (
    //     buyerTnc &&
    //     (!on_confirm.tags || !utils.isArrayEqual(buyerTnc, on_confirm.tags))
    //   ) {
    //     // logger.info(buyerTnc);
    //     onCnfrmObj.buyertnc = `Buyer's T&C in tags mismatches in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`;
    //   }
    // } catch (error) {
    //   logger.info(
    //     `!!Error while checking buyer's T&C in /${constants.RET_CONFIRM} and /${constants.RET_ONCONFIRM}`,
    //     error
    //   );
    // }

    // dao.setValue("onCnfrmObj", onCnfrmObj);
    return onCnfrmObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_ONCONFIRM} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_ONCONFIRM} API`,
        err
      );
    }
  }
};
module.exports = checkOnConfirm;
