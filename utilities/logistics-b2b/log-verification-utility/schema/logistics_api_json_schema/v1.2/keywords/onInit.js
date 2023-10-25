module.exports = {
  isQuoteMatching: (data) => {
    const quotePrice = parseFloat(data?.price?.value);
    const breakupArr = data.breakup;
    let totalBreakup = 0;
    breakupArr.forEach((breakup) => {
      totalBreakup += parseFloat(breakup?.price?.value);
    });
    if (quotePrice != totalBreakup) return false;
    else return true;
  },
};
