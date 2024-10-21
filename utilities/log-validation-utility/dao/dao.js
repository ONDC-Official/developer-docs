const { open } = require("lmdb");
const constants = require("../utils/constants");
const logger = require("../utils/logger");

const getConnection = () => {
  let myDB = open({
    path: constants.DB_PATH,
    // maxReaders:200, //maxReaders limit
    compression: true,
  });

  return myDB;
};

const setValue = (key, value) => {
  let myDB = getConnection();

  myDB.putSync(key, value);
  myDB.close();
};
const getValue = (key) => {
  let myDB = getConnection();
  let value = myDB.get(key);
  myDB.close();
  return value;
};

const dropDB = () => {
  let myDB = getConnection();
  return new Promise((resolve, reject) => {
    myDB
      .drop()
      .then((res) => {
        logger.info("DB Dropped Successfully!!", res);
      })
      .catch((err) => {
        logger.error("!!Error while removing LMDB");
      });
  });
};

module.exports = { getValue, setValue, dropDB };
