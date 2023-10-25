/**
 *
 * @param {string} lat The Latitude Coordinate upto 6 decimal place
 * @param {string } long The Longgitude Coordinate upto 6 decimal place
 * @param {string} area_code The Area Code to check the above lat-long pair against
 * @returns {boolean} Returns `true` if `area_code` matched lat-long pair
 */
 require("dotenv").config();
const reverseGeoCodingCheck = async (lat, long, area_code) => {
  var fetch = require("node-fetch");
  var requestOptions = {
    method: "GET",
  };
  try {
    const res = await fetch(`https://apis.mappls.com/advancedmaps/v1/${process.env.MAPPLS_API_KEY}/rev_geocode?lat=${lat}&lng=${long}`, requestOptions);
    const response = await res.json();
    return response.results[0].pincode === area_code
  } catch (error) {
    console.log(error);
  }
};

module.exports = { reverseGeoCodingCheck };
