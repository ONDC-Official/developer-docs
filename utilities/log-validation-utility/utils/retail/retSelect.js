const fs = require("fs");
const _ = require("lodash");
const dao = require("../../dao/dao");
const utils = require("../utils");
const { checkContext } = require("../../services/service");
const constants = require("../constants");
const validateSchema = require("../schemaValidation");
const logger = require("../logger");

const checkSelect = (dirPath, msgIdSet) => {
  //list to store selected items

  let selectedPrice = 0;
  let itemsIdList = {};
  let itemsCtgrs = {};
  let itemsTat = [];
  let slctObj = {};

  try {
    let select = fs.readFileSync(dirPath + `/${constants.RET_SELECT}.json`); //testing
    select = JSON.parse(select);
    try {
      logger.info(`Validating Schema for ${constants.RET_SELECT} API`);
      const vs = validateSchema("retail", constants.RET_SELECT, select);
      if (vs != "error") {
        // logger.info(vs);
        Object.assign(slctObj, vs);
      }
    } catch (error) {
      logger.error(
        `!!Error occurred while performing schema validation for /${constants.RET_SELECT}, ${error.stack}`
          .stack
      );
    }

    logger.info(`Checking context for ${constants.RET_SELECT} API`); //checking context
    try {
      res = checkContext(select.context, constants.RET_SELECT);
      if (!res.valid) {
        Object.assign(slctObj, res.ERRORS);
      }
    } catch (error) {
      logger.info(
        `Some error occurred while checking /${constants.RET_SELECT} context, ${error.stack}`
          .stack
      );
    }

    try {
      logger.info(
        `Comparing city of /${constants.RET_SEARCH} and /${constants.RET_SELECT}`
      );
      if (!_.isEqual(dao.getValue("city"), select.context.city)) {
        slctObj.city = `City code mismatch in /${constants.RET_SEARCH} and /${constants.RET_SELECT}`;
      }
    } catch (error) {
      logger.info(
        `Error while comparing city in /${constants.RET_SEARCH} and /${constants.RET_SELECT}, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing timestamp of /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`
      );
      if (_.gte(dao.getValue("tmpstmp"), select.context.timestamp)) {
        slctObj.tmpstmp = `Timestamp for /${constants.RET_ONSEARCH} api cannot be greater than or equal to /${constants.RET_SELECT} api`;
      }
      dao.setValue("tmpstmp", select.context.timestamp);
    } catch (error) {
      logger.info(
        `Error while comparing timestamp for /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing transaction Ids of /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`
      );
      // if (_.isEqual(dao.getValue("txnId"), select.context.transaction_id)) {
      //   slctObj.txnId = `Transaction Id for /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} api cannot be same`;
      // }
      dao.setValue("txnId", select.context.transaction_id);
    } catch (error) {
      logger.info(
        `Error while comparing transaction ids for /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} api, ${error.stack}`
      );
    }

    try {
      logger.info(
        `Comparing Message Ids of /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`
      );
      if (_.isEqual(dao.getValue("msgId"), select.context.message_id)) {
        slctObj.msgId = `Message Id for /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} api cannot be same`;
      }
      dao.setValue("msgId", select.context.message_id);
      // msgIdSet.add(select.context.message_id);
    } catch (error) {
      logger.info(
        `Error while comparing message ids for /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} api, ${error.stack}`
      );
    }

    select = select.message.order;

    try {
      let onSearch = dao.getValue("onSearch");

      let provider = onSearch["bpp/providers"].filter(
        (provider) => provider.id === select.provider.id
      );

      if (provider[0]) {
        provider = provider[0];
        dao.setValue("providerId", provider.id);
        dao.setValue("providerLoc", provider.locations[0].id);
        dao.setValue("providerGps", provider.locations[0].gps);
        dao.setValue("providerName", provider.descriptor.name);

        try {
          logger.info(
            `Comparing provider location in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`
          );
          if (provider.locations[0].id != select.provider.locations[0].id) {
            slctObj.prvdLoc = `provider.locations[0].id ${provider.locations[0].id} mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`;
          }
        } catch (error) {
          logger.error(
            `!!Error while comparing provider's location id in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`,
            error
          );
        }

        logger.info(
          `Mapping Item Ids with their counts, categories and prices /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`
        );
        try {
          select.items.forEach((item) => {
            let itemOnSearch = provider.items.find((it) => it.id === item.id);

            if (!itemOnSearch) {
              key = `id${item.id}`;
              slctObj[
                key
              ] = `Item Id ${item.id} does not exist in /${constants.RET_ONSEARCH}`;
            } else {
              logger.info(
                `ITEM ID: ${item.id}, Price: ${itemOnSearch.price.value}, Count: ${item.quantity.count}`
              );
              if (
                item.location_id &&
                itemOnSearch.location_id != item.location_id
              ) {
                slctObj.itemLocErr = `Location id for Item ${item.id} mismatches in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`;
              }
              itemsIdList[item.id] = item.quantity.count;
              itemsCtgrs[item.id] = itemOnSearch.category_id;
              itemsTat.push(itemOnSearch["@ondc/org/time_to_ship"]);
              selectedPrice += itemOnSearch.price.value * item.quantity.count;
            }
          });

          try {
            logger.info(`Saving time_to_ship in /${constants.RET_ONSEARCH}`);
            let timeToShip = 0;
            logger.info("ITEMSDKJDKLSJF", itemsTat);
            itemsTat.forEach((tts) => {
              const ttship = utils.isoDurToSec(tts);
              logger.info(ttship);
              timeToShip = Math.max(timeToShip, ttship);
            });
            logger.info("timeTOSHIP", timeToShip);
            dao.setValue("timeToShip", timeToShip);
          } catch (error) {
            logger.error(
              `!!Error while saving time_to_ship in ${constants.RET_ONSEARCH}`,
              error
            );
          }

          dao.setValue("itemsIdList", itemsIdList);
          dao.setValue("itemsCtgrs", itemsCtgrs);
          dao.setValue("selectedPrice", selectedPrice);

          logger.info(
            `Provider Id in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} matched`
          );
        } catch (error) {
          logger.error(
            `!!Error while Comparing and Mapping Items in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT}`,
            error
          );
        }
      } else {
        logger.info(
          `Provider Ids in /${constants.RET_ONSEARCH} and /${constants.RET_SELECT} mismatch`
        );
        slctObj.prvdrIdMatch = `Provider Id ${select.provider.id} in /${constants.RET_SELECT} does not exist in /${constants.RET_ONSEARCH}`;
      }
    } catch (error) {
      logger.error(
        `!!Error occcurred while checking providers info in /${constants.RET_SELECT}`
      );
    }

    try {
      select.fulfillments.forEach((ff, indx) => {
        logger.info(`Checking GPS Precision in /${constants.RET_SELECT}`);

        if (ff.hasOwnProperty("end")) {
          dao.setValue("buyerGps", ff.end.location.gps);
          dao.setValue("buyerAddr", ff.end.location.address.area_code);
          const gps = ff.end.location.gps.split(",");
          const gpsLat = gps[0];
          const gpsLong = gps[1];
          // logger.info(gpsLat, " sfsfdsf ", gpsLong);
          if (!gpsLat || !gpsLong) {
            slctObj.gpsErr = `fulfillments location.gps is not as per the API contract`;
          }

          if (!ff.end.location.address.hasOwnProperty("area_code")) {
            slctObj.areaCode = `address.area_code is required property in /${constants.RET_SELECT}`;
          }
        }
      });
    } catch (error) {
      logger.error(
        `!!Error while checking GPS Precision in /${constants.RET_SELECT}, ${error.stack}`
          .stack
      );
    }

    logger.info("Total Price of Selected Items:", selectedPrice);
    // dao.setValue("slctObj", slctObj);
    return slctObj;
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.info(`!!File not found for /${constants.RET_SELECT} API!`);
    } else {
      logger.error(
        `!!Some error occurred while checking /${constants.RET_SELECT} API`,
        err
      );
    }
  }
};

module.exports = checkSelect;
