const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");
const { reverseGeoCodingCheck } = require("../reverseGeoCoding");

const checkSearch = async (data, msgIdSet) => {
  let srchObj = {};
  let search = data;
  let contextTime = search.context.timestamp;
  search = search.message.intent;

  const stops = data?.message?.intent?.fulfillment?.stops;
  let startLocation, endLocation;
  stops.forEach((stop) => {
    if (stop.type === "start") {
      startLocation = stop.location;
    }
    if (stop.type === "end") {
      endLocation = stop.location;
    }
  });

  console.log("Checking Reverse Geocoding for `end` location in `fullfilment`");
  try {
    const [lat, long] = endLocation.gps.split(",");
    const area_code = endLocation.area_code;
    const match = await reverseGeoCodingCheck(lat, long, area_code);
    if (!match)
      srchObj[
        "RGC-end-Err"
      ] = `Reverse Geocoding for \`end\` failed. Area Code ${area_code} not matching with ${lat},${long} Lat-Long pair.`;
  } catch (error) {
    console.log("Error in end location", error);
  }

  // check for context cityCode and fulfillment end location
  try {
    const pinToStd = JSON.parse(
      fs.readFileSync(path.join(__dirname, "pinToStd.json"), "utf8")
    );
    const stdCode = data.context?.location?.city?.code.split(":")[1];
    const area_code = endLocation?.area_code;
    if (pinToStd[area_code] && pinToStd[area_code] != stdCode) {
      srchObj[
        "CityCode-Err"
      ] = `CityCode ${stdCode} should match the city for the fulfillment end location ${area_code}, ${pinToStd[area_code]}`;
    }
  } catch (err) {
    console.error("Error in city code check: ", err.message);
  }

  dao.setValue("searchObj", search);
  return srchObj;
};

module.exports = checkSearch;
