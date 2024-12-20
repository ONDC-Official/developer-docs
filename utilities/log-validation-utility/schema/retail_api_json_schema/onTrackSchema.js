module.exports = {
  type: "object",
  properties: {
    tracking: {
      type: "object",
      properties: {
        url: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] },
      },
      required: ["status"],
    },
  },
};
