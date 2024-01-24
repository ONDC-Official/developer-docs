module.exports = {
  isFutureDated: (data) => {
    const contextTime = data?.context?.timestamp;
    const created_at = data?.message?.order?.created_at;
    const updated_at = data?.message?.order?.updated_at;
    if (
      (created_at && created_at > contextTime) ||
      (updated_at && updated_at > contextTime)
    )
      return false;
    return true;
  },
};
