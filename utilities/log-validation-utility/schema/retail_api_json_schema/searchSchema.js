module.exports = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "nic2004:52110",
        },
        action: {
          type: "string",
          const: "search",
        },
        country: {
          type: "string",
        },
        city: {
          type: "string",
        },
        core_version: {
          type: "string",
          const: "1.1.0",
        },
        bap_id: {
          type: "string",
        },
        bap_uri: {
          type: "string",
        },
        transaction_id: {
          type: "string",
        },
        message_id: {
          type: "string",
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string",
          format: "duration",
        },
      },
      required: [
        "domain",
        "action",
        "country",
        "city",
        "core_version",
        "bap_id",
        "bap_uri",
        "transaction_id",
        "message_id",
        "timestamp",
        "ttl",
      ],
    },
    message: {
      type: "object",
      properties: {
        intent: {
          type: "object",
          properties: {
            item: {
              type: "object",
              properties: {
                descriptor: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                  },
                  required: ["name"],
                },
              },
              required: ["descriptor"],
            },
            fulfillment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: "Delivery",
                },
                end: {
                  type: "object",
                  properties: {
                    location: {
                      type: "object",
                      properties: {
                        gps: {
                          type: "string",
                        },
                        address: {
                          type: "object",
                          properties: {
                            area_code: {
                              type: "string",
                            },
                          },
                          required: ["area_code"],
                        },
                      },
                      required: ["gps"],
                    },
                  },
                  required: ["location"],
                },
              },
              required: ["type", "end"],
            },
            payment: {
              type: "object",
              properties: {
                "@ondc/org/buyer_app_finder_fee_type": {
                  type: "string",
                  const: "percent",
                },
                "@ondc/org/buyer_app_finder_fee_amount": {
                  type: "string",
                },
              },
              required: [
                "@ondc/org/buyer_app_finder_fee_type",
                "@ondc/org/buyer_app_finder_fee_amount",
              ],
            },
          },
          required: ["item", "fulfillment", "payment"],
        },
      },
      required: ["intent"],
    },
  },
  required: ["context", "message"],
};
