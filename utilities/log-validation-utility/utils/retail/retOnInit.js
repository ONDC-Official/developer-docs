const fs = require("fs");
const _ = require("lodash");
const { checkContext } = require("../../services/service");
const dao = require("../../dao/dao");
const validateSchema = require("../schemaValidation");
const constants = require("../constants");

const checkOnInit = (dirPath, msgIdSet) => {
  let onInitObj = {};

  try {
    var on_init = fs.readFileSync(dirPath + `/${constants.RET_ONINIT}.json`);

    on_init = JSON.parse(on_init);

    try {
      console.log(`Validating Schema for /${constants.RET_ONINIT} API`);
      const vs = validateSchema("retail", constants.RET_ONINIT, on_init);
      if (vs != "error") {
        // console.log(vs);
        Object.assign(onInitObj, vs);
      }
    } catch (error) {
      console.log(
        `!!Error occurred while performing schema validation for /${constants.RET_ONINIT}`,
        error
      );
    }

    console.log(`Checking context for /${constants.RET_ONINIT} API`); //checking context
    try {
      res = checkContext(on_init.context, constants.RET_ONINIT);
      if (!res.valid) {
        Object.assign(onInitObj, res.ERRORS);
      }
    } catch (error) {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONINIT} context`,
        error
      );
    }

    try {
      console.log(
        `Comparing city of ${constants.RET_SEARCH} & ${constants.RET_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("city"), on_init.context.city)) {
        onInitObj.city = `City code mismatch in ${constants.RET_SEARCH} & ${constants.RET_ONINIT}`;
      }
    } catch (error) {
      console.log(
        `Error while comparing city in ${constants.RET_SEARCH} & ${constants.RET_ONINIT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing timestamp of ${constants.RET_INIT} & ${constants.RET_ONINIT}`
      );
      if (_.gte(dao.getValue("tmpstmp"), on_init.context.timestamp)) {
        onInitObj.tmpstmp = `Timestamp for ${constants.RET_INIT} api cannot be greater than or equal to ${constants.RET_ONINIT} api`;
      }
      dao.setValue("tmpstmp", on_init.context.timestamp);
    } catch (error) {
      console.log(
        `!!Error while comparing timestamp for /${constants.RET_INIT} and /${constants.RET_ONINIT} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing transaction Ids of /${constants.RET_SELECT} & /${constants.RET_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("txnId"), on_init.context.transaction_id)) {
        onInitObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} & /${constants.RET_ONINIT} api`,
        error
      );
    }

    try {
      console.log(
        `Comparing Message Ids of /${constants.RET_INIT} and /${constants.RET_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("msgId"), on_init.context.message_id)) {
        onInitObj.msgId = `Message Ids for /${constants.RET_INIT} and /${constants.RET_ONINIT} api should be same`;
      }

      // if (msgIdSet.has(init.context.message_id)) {
      //   initObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      // }
      // msgId = select.context.message_id;
      msgIdSet.add(on_init.context.message_id);
    } catch (error) {
      console.log(
        `!!Error while checking message id for /${constants.RET_INIT}`,
        error
      );
    }

    on_init = on_init.message.order;

    try {
      console.log(
        `Checking provider Id and provider_location Id in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`
      );
      if (
        !on_init.provider ||
        on_init.provider.id != dao.getValue("providerId")
      ) {
        onInitObj.prvdrId = `Provider Id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`;
      }

      if (
        on_init.hasOwnProperty("provider_location") &&
        (!on_init.provider_location.id ||
          on_init.provider_location.id != dao.getValue("providerLoc"))
      ) {
        onInitObj.prvdrLoc = `provider_location.id mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`;
      } else if (!on_init.hasOwnProperty("provider_location")) {
        onInitObj.prvdrloc = `provider_location object is missing in /${constants.RET_ONINIT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing provider Id and location Id in /${constants.RET_ONSEARCH} and /${constants.RET_ONINIT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing item Ids and fulfillment Ids in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
      );
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      const itemsIdList = dao.getValue("itemsIdList");
      let i = 0;
      const len = on_init.items.length;
      while (i < len) {
        let itemId = on_init.items[i].id;
        if (itemId in itemFlfllmnts) {
          if (on_init.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            let itemkey = `item_FFErr${i}`;
            onInitObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId}} in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`;
          }
        } else {
          let itemkey = `item_FFErr${i}`;
          onInitObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`;
        }

        if (itemId in itemsIdList) {
          if (on_init.items[i].quantity.count != itemsIdList[itemId]) {
            onInitObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`;
          }
        }

        i++;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`,
        error
      );
    }

    try {
      console.log(
        `Comparing billing object in /${constants.RET_INIT} and /${constants.RET_ONINIT}`
      );
      const billing = dao.getValue("billing");
      if (!_.isEqual(billing, on_init.billing)) {
        onInitObj.bill = `Billing object mismatches in /${constants.RET_INIT} and /${constants.RET_ONINIT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while comparing billing object in /${constants.RET_INIT} and /${constants.RET_ONINIT}`,
        error
      );
    }

    try {
      console.log(`Checking fulfillments objects in /${constants.RET_ONINIT}`);
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      let i = 0;
      const len = on_init.fulfillments.length;
      while (i < len) {
        //Comparing fulfillment Ids

        if (on_init.fulfillments[i].id) {
          let id = on_init.fulfillments[i].id;
          if (!Object.values(itemFlfllmnts).includes(id)) {
            key = `ffID${id}`;
            //MM->Mismatch
            onInitObj[
              key
            ] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`;
          }
        } else {
          onInitObj.ffId = `fulfillments[].id is missing in /${constants.RET_ONINIT}`;
        }

        if (
          !_.isEqual(
            on_init.fulfillments[i].end.location.gps,
            dao.getValue("buyerGps")
          )
        ) {
          gpskey = `gpsKey${i}`;
          onInitObj[
            gpskey
          ] = `gps coordinates in fulfillments[${i}].end.location mismatch in /${constants.RET_SELECT} & /${constants.RET_ONINIT}`;
        }

        if (
          !_.isEqual(
            on_init.fulfillments[i].end.location.address.area_code,
            dao.getValue("buyerAddr")
          )
        ) {
          addrkey = `addrKey${i}`;
          onInitObj[
            addrkey
          ] = `address.area_code in fulfillments[${i}].end.location mismatch in /${constants.RET_SELECT} & /${constants.RET_ONINIT}`;
        }

        //Comparing Provider_id
        // if (on_init.fulfillments[i].provider_id) {
        //   let prvdrId = on_init.fulfillments[i].provider_id;
        //   if (prvdrId != dao.getValue("bppId")) {
        //     let key = `ffPrvdrId${prvdrId}`;
        //     onInitObj[key] = `Provider Id for fulfillment ${
        //       on_init.fulfillments[i].id || ""
        //     } should be the bpp_id as per the contract`;
        //   }
        // }
        i++;
      }
    } catch (error) {
      console.log(
        `!!Error while checking fulfillments object in /${constants.RET_ONINIT}`,
        error
      );
    }

    let initQuotePrice = 0;
    let initBreakupPrice = 0;
    // dao.setValue("onInitQuote", on_init.quote);
    console.log(`Calculating Net /${constants.RET_ONINIT} Price breakup`);
    on_init.quote.breakup.forEach((element) => {
      initBreakupPrice += parseFloat(element.price.value);
    });
    console.log(`/${constants.RET_ONINIT} Price Breakup: ${initBreakupPrice}`);

    initQuotePrice = parseFloat(on_init.quote.price.value);

    console.log(`/${constants.RET_ONINIT} Quoted Price: ${initQuotePrice}`);

    console.log(
      `Comparing /${constants.RET_ONINIT} Quoted Price and Net Price Breakup`
    );
    if (initQuotePrice != initBreakupPrice) {
      console.log(
        `Quoted Price in /${constants.RET_ONINIT} is not equal to the Net Breakup Price`
      );
      onInitObj.onInitPriceErr = `Quoted Price ${initQuotePrice} does not match with Net Breakup Price ${initBreakupPrice} in /${constants.RET_ONINIT}`;
    }

    console.log(
      `Comparing /${constants.RET_ONINIT} Quoted Price and /${constants.RET_ONSELECT} Quoted Price`
    );
    const onSelectPrice = dao.getValue("onSelectPrice");
    if (onSelectPrice != initQuotePrice) {
      console.log(
        `Quoted Price in /${constants.RET_ONINIT} is not equal to the quoted price in /${constants.RET_ONSELECT}`
      );
      onInitObj.onInitPriceErr2 = `Quoted Price in /${constants.RET_ONINIT} INR ${initQuotePrice} does not match with the quoted price in /${constants.RET_ONSELECT} INR ${onSelectPrice}`;
    }

    console.log(`Checking Payment Object for  /${constants.RET_ONINIT}`);
    if (!on_init.payment) {
      onInitObj.pymntOnInitObj = `Payment Object can't be null in /${constants.RET_ONINIT}`;
    }

    try {
      console.log(
        `Checking Buyer App finder fee amount in /${constants.RET_ONINIT}`
      );
      const buyerFF = dao.getValue("buyerFF");
      // if (on_init.payment["@ondc/org/buyer_app_finder_fee_amount"])
      if (
        !on_init.payment["@ondc/org/buyer_app_finder_fee_amount"] ||
        parseFloat(on_init.payment["@ondc/org/buyer_app_finder_fee_amount"]) !=
          buyerFF
      ) {
        onInitObj.buyerFF = `Buyer app finder fee can't change in /${constants.RET_ONINIT}`;
        // console.log(`Buyer app finder fee amount can't change in /on_init`);
      }
    } catch (error) {
      console.log(
        `!!Error while checking buyer app finder fee in /${constants.RET_ONINIT}`,
        error
      );
    }

    try {
      console.log(
        `Checking Quote Object in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
      );
      if (!_.isEqual(dao.getValue("quoteObj"), on_init.quote)) {
        onInitObj.quoteErr = `Discrepancies between the quote object in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking quote object in /${constants.RET_ONSELECT} and /${constants.RET_ONINIT}`
      );
    }

    //CHECKING PAYMENT OBJECT IN /ON_INIT
    // try {
    //   console.log("checking payment object in /on_init");
    //   if (
    //     on_init.payment.collected_by === "BAP" &&
    //     on_init.payment["@ondc/org/settlement_details"][0][
    //       "settlement_counterparty"
    //     ] != "seller-app"
    //   ) {
    //     onInitObj.sttlmntcntrparty = `settlement_counterparty should be 'seller-app' when payment.collected_by is BAP`;
    //   }

    //   if (
    //     on_init.payment.collected_by === "BPP" &&
    //     on_init.payment["@ondc/org/settlement_details"][0][
    //       "settlement_counterparty"
    //     ] != "buyer-app"
    //   ) {
    //     onInitObj.sttlmntcntrparty = `settlement_counterparty should be 'buyer-app' when payment.collected_by is BPP`;
    //   }

    //   dao.setValue("paymentType", on_init.payment.type);
    //   dao.setValue("pymntCollectedBy", on_init.payment.collected_by);
    // } catch (error) {
    //   console.log(
    //     `!!Error while checking payment object in /${constants.RET_ONINIT}`,
    //     error
    //   );
    // }

    try {
      console.log(`checking payment object in /${constants.RET_ONINIT}`);
      if (
        on_init.payment["@ondc/org/settlement_details"][0][
          "settlement_counterparty"
        ] != "seller-app"
      ) {
        onInitObj.sttlmntcntrparty = `settlement_counterparty is expected to be 'seller-app' in @ondc/org/settlement_details`;
      }
    } catch (error) {
      console.log(
        `!!Error while checking payment object in /${constants.RET_ONINIT}`
      );
    }

    try {
      console.log(
        `storing payment settlement details in /${constants.RET_ONINIT}`
      );
      if (on_init.payment.hasOwnProperty("@ondc/org/settlement_details"))
        dao.setValue(
          "sttlmntdtls",
          on_init.payment["@ondc/org/settlement_details"][0]
        );
      else {
        onInitObj.pymntSttlmntObj = `payment settlement_details missing in /${constants.RET_ONINIT}`;
      }
    } catch (error) {
      console.log(
        `!!Error while storing payment settlement details in /${constants.RET_ONINIT}`
      );
    }

    dao.setValue("onInitObj", onInitObj);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`!!File not found for /${constants.RET_ONINIT} API!`);
    } else {
      console.log(
        `!!Some error occurred while checking /${constants.RET_ONINIT} API`,
        err
      );
    }
  }
};

module.exports = checkOnInit;
