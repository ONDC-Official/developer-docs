module.exports = {
  type: "object",
  properties: {
    phone: {
      type: "string",
    },
    email: {
      type: "string",
      format: "email",
    },
    uri: { type: "string" },
  },
  required: ["phone"],
};
