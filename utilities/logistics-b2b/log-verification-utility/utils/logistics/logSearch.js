const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils.js");

const checkSearch = (data, msgIdSet) => {
  let srchObj = {};
  let search = data;
  let contextTime = search.context.timestamp;
  search = search.message.intent;

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
    console.log(error);
  }
  dao.setValue("searchObj", search);
  return srchObj;
};
module.exports = checkSearch;