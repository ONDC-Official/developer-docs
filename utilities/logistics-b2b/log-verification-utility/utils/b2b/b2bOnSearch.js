const _ = require("lodash");
const dao = require("../../dao/dao");
const constants = require("../constants");
const utils = require("../utils");
const checkOnSearch = (data, msgIdSet) => {
  const onSrchObj = {};
  let onSearch = data;
  onSearch = onSearch.message.catalog;

  try {
    console.log(
      `Saving provider items array in /on_search api`
    );
    if (onSearch["providers"]) {
      let providers = onSearch["providers"];
      dao.setValue("providersArr", providers);
      providers.forEach((provider, i) => {
        let itemsArr = provider.items;
        const providerId = provider.id;

        dao.setValue(`${providerId}itemsArr`, itemsArr);
      });
    }
  } catch (error) {
    console.log(
      `!!Error while checking providers array in /on_search api`,
      error
    );
  }

  return onSrchObj;
};
module.exports = checkOnSearch;