module.exports = {
  isEndTimeGreater: (data) => {
    const startTime = parseInt(data.start);
    const endTime = parseInt(data.end);
    return startTime < endTime;
  },
};
