module.exports = {
  isQuoteMatching: (data) => {
    let quotePrice = parseFloat(data?.price?.value);
    const breakupArr = data?.breakup;
    let totalBreakup = 0;
    breakupArr.forEach((breakup) => {
      totalBreakup += parseFloat(breakup?.price?.value);
      
    });
    totalBreakup= parseFloat(totalBreakup).toFixed(2)
    quotePrice=quotePrice.toFixed(2)
    if (quotePrice != totalBreakup) return false;
    else return true;
  },
};
