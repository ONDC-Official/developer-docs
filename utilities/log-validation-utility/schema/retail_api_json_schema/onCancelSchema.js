module.exports = {
  type: "object",
  properties: {
    id: { type: "string" },
    state: { type: "string", pattern: "^(?!s*$).+" },
    tags: {
      type: "object",
      properties: {
        cancellation_reason_id: {
          type: "string",
          minLength: 3,
          maxLength: 3,
        },
      },
      required: ["cancellation_reason_id"],
    },
  },
  required: ["id", "state", "tags"],
};
