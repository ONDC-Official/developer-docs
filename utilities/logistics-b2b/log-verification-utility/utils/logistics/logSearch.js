const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");
const {reverseGeoCodingCheck} = require("../reverseGeoCoding")

const checkSearch = async (data, msgIdSet) => {
  let srchObj = {};
  let search = data;
  let contextTime = search.context.timestamp;
  search = search.message.intent;

  const {
    start: { location: startLocation },
    end: { location: endLocation },
  } = data.message.intent.fulfillment;

  try {
    console.log(`Checking if holidays are in past date or not`);
    let holidays = search?.provider?.time?.schedule?.holidays;
    if (holidays && holidays.length > 0) {
      holidays.forEach((holiday, i) => {
        holidayDate = new Date(holiday);
        if (!utils.compareDates(holidayDate, contextTime)) {
          let itemKey = `holidayErr${i}`;
          srchObj[
            itemKey
          ] = `Holiday date '${holiday}' should not be past dated`;
        }
      });
    }
  } catch (error) {
    console.log("Error while checking holidays", error);
  }

  console.log("Checking Reverse Geocoding for `start` location in `fullfilment`")
  try {
    const [lat, long] = startLocation.gps.split(",")
    const area_code = startLocation.address.area_code
    const match = await reverseGeoCodingCheck(lat, long, area_code)
    if(!match) srchObj['RGC-start-Err'] = `Reverse Geocoding for \`start\` failed. Area Code ${area_code} not matching with ${lat},${long} Lat-Long pair.`
  } catch (error) {
    console.log("Error in start location", error)
  }

  // check for context cityCode and fulfillment start location
  try {
    const pinToStd = JSON.parse(fs.readFileSync(path.join(__dirname,'pinToStd.json'), 'utf8'));
    const stdCode = data.context.city.split(':')[1];
    const area_code = startLocation?.address?.area_code;
    if(pinToStd[area_code] && pinToStd[area_code] != stdCode){
      srchObj['CityCode-Err'] = `CityCode ${stdCode} should match the city for the fulfillment start location ${area_code}, ${pinToStd[area_code]}`;
    }
  } catch (err) {
    console.error("Error in city code check: ", err.message);
  }

  console.log("Checking Reverse Geocoding for `end` location in `fullfilment`")
  try {
    const [lat, long] = endLocation.gps.split(",")
    const area_code = endLocation.address.area_code
    const match = await reverseGeoCodingCheck(lat, long, area_code)
    if(!match) srchObj['RGC-end-Err'] = `Reverse Geocoding for \`end\` failed. Area Code ${area_code} not matching with ${lat},${long} Lat-Long pair.`
  } catch (error) {
    console.log("Error in end location",error)
  }
  //console.log("srchObj from search:", srchObj)
  dao.setValue("searchObj", search);
  return srchObj;
};
module.exports = checkSearch;
