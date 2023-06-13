module.exports = {
  type: "object",
  properties: {
    provider: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", minLength: 1 },
          fulfillment_id: { type: "string" },
        },
        required: ["id", "fulfillment_id"],
      },
    },

    quote: {
      type: "object",
      properties: {
        price: {
          type: "object",
          properties: {
            value: { type: "string", pattern: "^(\\d*.?\\d{1,2})$" },
            currency: { type: "string", pattern: "^(?!s*$).+" },
          },
          required: ["value", "currency"],
        },

        breakup: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", minLength: 1 },
              price: {
                type: "object",
                properties: {
                  value: {
                    type: "string",
                    minLength: 1,
                    pattern: "^(\\d*.?\\d{1,2})$",
                  },
                  currency: { type: "string" },
                },
                required: ["value", "currency"],
              },
              "@ondc/org/item_id": { type: "string" },
              item: {
                type: "object",
                properties: {
                  quantity: {
                    type: "object",
                    properties: {
                      maximum: {
                        type: "object",
                        properties: {
                          count: {
                            type: "string",
                          },
                        },
                      },
                      available: {
                        type: "object",
                        properties: {
                          count: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                  price: {
                    type: "object",
                    properties: {
                      value: {
                        type: "string",
                        minLength: 1,
                        pattern: "^(\\d*.?\\d{1,2})$",
                      },
                      currency: { type: "string", pattern: "^(?!s*$).+" },
                    },
                  },
                },
                required: ["price", "quantity"],
              },
              "@ondc/org/item_quantity": {
                type: "object",
                properties: {
                  count: {
                    type: "integer",
                  },
                },
                required: ["count"],
              },
              "@ondc/org/title_type": {
                type: "string",
                enum: [
                  "item",
                  "delivery",
                  "packing",
                  "tax",
                  "misc",
                  "discount",
                ],
              },
            },
            required: [
              "price",
              "title",
              "@ondc/org/title_type",
              "@ondc/org/item_id",
            ],
          },
        },

        ttl: { type: "string", format: "duration" },
      },
      required: ["ttl", "price", "breakup"],
    },

    fulfillments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", pattern: "^(?!s*$).+" },
          "@ondc/org/provider_name": { type: "string" },
          tracking: { type: "boolean" },
          "@ondc/org/category": {
            type: "string",
            enum: [
              "Express Delivery",
              "Standard Delivery",
              "Immediate Delivery",
              "Same Day Delivery",
              "Next Day Delivery",
            ],
          },
          "@ondc/org/TAT": { type: "string", format: "duration" },
          state: {
            type: "object",
            properties: {
              descriptor: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    enum: ["Serviceable", "Non-serviceable"],
                  },
                },
                required: ["code"],
              },
            },
            required: ["descriptor"],
          },
        },

        required: [
          "id",
          "@ondc/org/provider_name",
          "state",
          "@ondc/org/category",
          "@ondc/org/TAT",
        ],
      },
    },
  },
  required: ["provider", "items", "fulfillments", "quote"],
};
