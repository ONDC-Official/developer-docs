module.exports = {
  isLengthValid: (data) => {
    if (data.name.length + data.building.length + data.locality.length > 190)
      return false;
    else return true;
  },
};
