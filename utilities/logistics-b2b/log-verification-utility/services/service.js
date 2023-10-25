const { logisticsVal } = require("../utils/logistics/msgValidator");
const { b2bVal } = require("../utils/b2b/msgValidator");
const _ = require("lodash");

const checkMessage = async (domain, element, action, msgIdSet) => {
  const busnsErr = {};
  switch (domain) {
    case "logistics":
      return logisticsVal(element, action, msgIdSet);
    case "b2b":
      return b2bVal(element, action, msgIdSet);
  }
  return busnsErr;
};
module.exports = { checkMessage };