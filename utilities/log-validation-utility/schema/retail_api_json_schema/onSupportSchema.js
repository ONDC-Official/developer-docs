module.exports = {
  type: "object",
  properties: {
    phone: { type: "string", minLength: 10, maxLength: 11 },

    email: {
      type: "string",
      format: "email",
    },
    uri: { type: "string" },
  },
  required: ["phone"],
};
