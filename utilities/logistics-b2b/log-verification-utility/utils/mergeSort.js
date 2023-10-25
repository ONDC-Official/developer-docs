const fs = require("fs");
const path = require("path");
const constants = require("./constants");

const sortMerge = (domain, directory, destination) => {
  flowErrObj = {};
  try {
    var mergedlogs = [];

    files = fs.readdirSync(directory);

    let map;
    switch (domain) {
      case "logistics":
        map = constants.LOG_SORTED_INDEX;
        break;
      case "b2b":
        map = constants.B2B_SORTED_INDEX;
        break;
    }

    mergedlogs = files.reduce((acc, item) => {
      // Skip processing if the file name matches "merged.json" or "log_report.json"
      if (item === "merged.json" || item === "log_report.json") {
        return acc;
      }
      try {
        if (item.match(/\.json$/)) {
          let data = fs.readFileSync(`${directory}/${item}`);
          data = JSON.parse(data);
          const context = data.context;
          if (!context || !context.action) {
            console.log(
              `Error in file ${item}: Missing 'context' or 'action' property`
            );
            return acc; // Skip this data and continue with the next iteration
          }
          const { action } = data.context;

          if (!acc[action]) {
            acc[action] = [];
          }

          acc[action].push(data);
          return acc;
        }
      } catch (error) {
        console.log(`Error in file ${item}`);
        console.trace(error);
      }
    }, {});

    let oldLogs;
    if(fs.existsSync(destination)){
      oldLogs = fs.readFileSync(destination, 'utf8');
    }
    
    oldLogs = oldLogs ? JSON.parse(oldLogs) : {};
    mergedlogs = { ...oldLogs, ...mergedlogs };

    // Sort the arrays within each action based on context.timestamp
    for (const action in mergedlogs) {
      const array = mergedlogs[action];
      if (array.length > 1) {
        array.sort(
          (a, b) =>
            new Date(a.context.timestamp) - new Date(b.context.timestamp)
        );
      }
    }

    // Sort the mergedlogs object based on the first element of each array's context.timestamp
    const sortedmergedlogs = {};
    Object.keys(mergedlogs)
      .sort(
        (a, b) =>
          new Date(mergedlogs[a][0].context.timestamp) -
          new Date(mergedlogs[b][0].context.timestamp)
      )
      .forEach((key) => {
        sortedmergedlogs[key] = mergedlogs[key];
      });

    // Assign the sorted data back to mergedlogs
    mergedlogs = sortedmergedlogs;

    Object.entries(mergedlogs).forEach(([action], i, entries) => {
      const curAction = action;
      if (map.includes(curAction)) {
        const curIndex = map.indexOf(curAction);
        if (i != curIndex) {
          console.log(
            `Flow incorrect- current action: ${action}, Current Index:${i}, Index in correct flow:${curIndex}`
          );
          flowErrObj[
            0
          ] = `Incorrect Flow as per context/timestamps - (${Object.keys(
            mergedlogs
          )})`;
          
        }
      }
    });
    
    fs.writeFileSync(destination, JSON.stringify(mergedlogs));
    return flowErrObj;
  } catch (err) {
    console.log(`Error while running merging log files, ${err}`);
    console.trace(err);
  }
};
module.exports = { sortMerge };
