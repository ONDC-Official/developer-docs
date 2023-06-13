const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const logger = require("../logger");

const checkInit = (dirPath, msgIdSet) => {
  let initObj = {};
  try {
    var init = fs.readFileSync(dirPath + `/${constants.RET_INIT}.json`);
    init = JSON.parse(init);

    try {
      logger.info(`Validating Schema for ${constants.RET_INIT} API`);
      const vs = validateSchema("retail", constants.RET_INIT, init);
      if (vs != "error") {
        Object.assign(initObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_INIT}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking context for /${constants.RET_INIT} API`); //checking context
      res = checkContext(init.context, constants.RET_INIT);
      if (!res.valid) {
        Object.assign(initObj, res.ERRORS);
      }
    } catch (error) {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_INIT} context, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_INIT}`
      );

      if (!_.isEqual(dao.getValue("city"), init.context.city)) {
        initObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_INIT}`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_INIT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_ONSELECT} and /${constants.RET_INIT}`
      );
      if (_.gte(dao.getValue("tmpstmp"), init.context.timestamp)) {
        initObj.tmpstmp = `Timestamp for  /${constants.RET_ONSELECT} api cannot be greater than or equal to /init api`;
      }
      dao.setValue("tmpstmp", init.context.timestamp);
    } catch (error) {
      logger.error(
        `!!Error while comparing timestamp for /${constants.RET_ONSELECT} and /${constants.RET_INIT} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_SELECT} and /${constants.RET_INIT}`
      );
      if (!_.isEqual(dao.getValue("txnId"), init.context.transaction_id)) {
        initObj.txnId = `Transaction Id should be same from /${constants.RET_SELECT} onwards`;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing transaction ids for /${constants.RET_SELECT} and /${constants.RET_INIT} api, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking Message Ids of /${constants.RET_INIT}`);
      // if (!_.isEqual(msgId, onSelect.context.message_id)) {
      //   onSlctObj.msgId =
      //     "Message Id for /select and /on_select api should be same";
      // }

      if (msgIdSet.has(init.context.message_id)) {
        initObj.msgId2 = "Message Id cannot be same for different sets of APIs";
      }
      dao.setValue("msgId", init.context.message_id);
      // msgIdSet.add(onSelect.context.message_id);
    } catch (error) {
      logger.info(
        `Error while checking message id for /${constants.RET_INIT}, ${error.stack}`
      );
    }

    init = init.message.order;

    try {
      logger.info(
        `Comparing provider object in /${constants.RET_SELECT} and /${constants.RET_INIT}`
      );

      if (dao.getValue("providerId") != init.provider["id"]) {
        initObj.prvdId = `Provider Id mismatches in /${constants.RET_SELECT} and /${constants.RET_INIT}`;
      }

      if (dao.getValue("providerLoc") != init.provider.locations[0].id) {
        initObj.prvdfrLoc = `Provider.locations[0].id mismatches in /${constants.RET_SELECT} and /${constants.RET_INIT}`;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking provider object in /${constants.RET_SELECT} and /${constants.RET_INIT}, ${error.stack}`
      );
    }

    try {
      logger.info(`Checking billing object in /${constants.RET_INIT}`);
      if (!init["billing"]) {
        initObj.bill = `Billing object missing in /${constants.RET_INIT}`;
      } else {
        const billing = init.billing;
        const tmpstmp = dao.getValue("tmpstmp");
        dao.setValue("billing", billing);
        if (!_.isEqual(billing.created_at, tmpstmp)) {
          initObj.bllngCrtd = `billing/created_at should match context.timestamp`;
        }

        if (!_.isEqual(init.billing.updated_at, tmpstmp)) {
          initObj.bllngUptd = `billing/updated_at should match context.timestamp`;
        }
        // if (
        //   !_.isEqual(init.billing.address.area_code, dao.getValue("buyerAddr"))
        // ) {
        //   initObj.billAreaCode = `area_code in billing.address does not match with area_code in /${constants.RET_SELECT}`;
        // }
      }
    } catch (error) {
      logger.error(
        `!!Error while checking billing object in /${constants.RET_INIT}, ${error.stack}`
      );
    }

    try {
      //checking address components length
      const noOfFulfillments = init.fulfillments.length; //will be 1 ideally
      let i = 0;
      while (i < noOfFulfillments) {
        const address = init.fulfillments[i].end.location.address;

        const lenName = address.name.length;
        const lenBuilding = address.building.length;
        const lenLocality = address.locality.length;

        if (lenName + lenBuilding + lenLocality >= 190) {
          initObj.addressLen = `address.name + address.building + address.locality should be less than 190 chars;`;
        }
        if (lenBuilding <= 3) {
          initObj.lenBuilding = `address.building should be more than 3 chars`;
        }
        if (lenName <= 3) {
          initObj.lenName = `address.name should be more than 3 chars`;
        }
        if (lenLocality <= 3) {
          initObj.lenLocality = `address.locality should be more than 3 chars`;
        }

        if (
          address.building === address.locality ||
          address.name === address.building ||
          address.name === address.locality
        ) {
          initObj.addressComponents = `value of address.name, address.building and address.locality should be unique`;
        }

        i++;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking address components in /${constants.RET_INIT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing item Ids and fulfillment ids in /${constants.RET_ONSELECT} and /${constants.RET_INIT}`
      );
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      const itemsIdList = dao.getValue("itemsIdList");
      let i = 0;
      const len = init.items.length;
      while (i < len) {
        let itemId = init.items[i].id;
        if (itemId in itemFlfllmnts) {
          if (init.items[i].fulfillment_id != itemFlfllmnts[itemId]) {
            let itemkey = `item_FFErr${i}`;
            initObj[
              itemkey
            ] = `items[${i}].fulfillment_id mismatches for Item ${itemId} in /${constants.RET_ONSELECT} and /${constants.RET_INIT}`;
          }
        } else {
          let itemkey = `item_FFErr${i}`;
          initObj[itemkey] = `Item Id ${itemId} does not exist in /on_select`;
        }

        if (itemId in itemsIdList) {
          if (init.items[i].quantity.count != itemsIdList[itemId]) {
            initObj.cntErr = `Warning: items[${i}].quantity.count for item ${itemId} mismatches with the items quantity selected in /${constants.RET_SELECT}`;
          }
        }
        i++;
      }
    } catch (error) {
      logger.error(
        `!!Error while comparing Item and Fulfillment Id in /${constants.RET_ONSELECT} and /${constants.RET_INIT}`
      );
    }

    try {
      logger.info(`Checking fulfillments objects in /${constants.RET_INIT}`);
      const itemFlfllmnts = dao.getValue("itemFlfllmnts");
      let i = 0;
      const len = init.fulfillments.length;
      while (i < len) {
        //Comparing fulfillment Ids
        let id = init.fulfillments[i].id;
        if (id) {
          if (!Object.values(itemFlfllmnts).includes(id)) {
            key = `ffID${id}`;
            //MM->Mismatch
            initObj[
              key
            ] = `fulfillment id ${id} does not exist in /${constants.RET_ONSELECT}`;
          }

          if (
            !_.isEqual(
              init.fulfillments[i].end.location.gps,
              dao.getValue("buyerGps")
            )
          ) {
            gpskey = `gpsKey${i}`;
            initObj[
              gpskey
            ] = `gps coordinates in fulfillments[${i}].end.location mismatch in /${constants.RET_SELECT} & /${constants.RET_INIT}`;
          }

          if (
            !_.isEqual(
              init.fulfillments[i].end.location.address.area_code,
              dao.getValue("buyerAddr")
            )
          ) {
            addrkey = `addrKey${i}`;
            initObj[
              addrkey
            ] = `address.area_code in fulfillments[${i}].end.location mismatch in /${constants.RET_SELECT} & /${constants.RET_INIT}`;
          }

          //Comparing Provider_id
          // if (init.fulfillments[i].provider_id) {
          //   let prvdrId = init.fulfillments[i].provider_id;
          //   if (prvdrId != dao.getValue("bppId")) {
          //     let key = `ffPrvdrId${prvdrId}`;
          //     initObj[
          //       key
          //     ] = `Provider Id for fulfillment ${id} should be the bpp_id as per the contract`;
          //   }
          // }
        } else {
          initObj.ffId = `fulfillments[${i}].id is missing in /${constants.RET_INIT}`;
        }

        i++;
      }
    } catch (error) {
      logger.error(
        `!!Error while checking fulfillments object in /${constants.RET_INIT}, ${error.stack}`
      );
    }

    // dao.setValue("initObj", initObj);
    return initObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_INIT} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_INIT} API`,
        err
      );
    }
  }
};

module.exports = checkInit;
