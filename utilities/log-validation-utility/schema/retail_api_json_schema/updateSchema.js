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
          const: "update",
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
        bpp_id: {
          type: "string",
        },
        bpp_uri: {
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
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "timestamp",
        "ttl",
      ],
    },
    message: {
      type: "object",
      properties: {
        update_target: {
          type: "string",
          enum: ["item", "billing"],
        },
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            state: {
              type: "string",
              enum: ["Created", "Accepted", "In-progress", "Completed"],
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  quantity: {
                    type: "object",
                    properties: {
                      count: {
                        type: "integer",
                      },
                    },
                    required: ["count"],
                  },
                  tags: {
                    type: "object",
                    properties: {
                      update_type: {
                        type: "string",
                        const: "return",
                      },
                      reason_code: {
                        type: "string",
                        minLength: 3,
                        maxLength: 3,
                      },
                      ttl_approval: {
                        type: "string",
                        format: "duration",
                      },
                      ttl_reverseqc: {
                        type: "string",
                        format: "duration",
                      },
                      image: {
                        type: "string",
                      },
                    },
                    required: ["update_type"],
                    allOf: [
                      {
                        if: {
                          properties: {
                            update_type: {
                              const: "return",
                            },
                            reason_code: { type: "string" },
                          },
                          required: ["update_type"],
                        },
                        then: { required: ["reason_code"] },
                      },
                    ],
                  },
                },
                required: ["id", "quantity", "tags"],
              },
            },
            payment: {
              type: "object",
              properties: {
                "@ondc/org/settlement_details": {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      settlement_counterparty: {
                        type: "string",
                        const: "buyer",
                      },
                      settlement_phase: {
                        type: "string",
                        const: "refund",
                      },
                      settlement_type: {
                        type: "string",
                      },
                      settlement_amount: {
                        type: "string",
                      },
                      settlement_timestamp: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                    required: [
                      "settlement_counterparty",
                      "settlement_phase",
                      "settlement_type",
                      "settlement_amount",
                      "settlement_timestamp",
                    ],
                  },
                },
              },
              required: ["@ondc/org/settlement_details"],
            },
          },
          required: ["id", "state", "provider", "items"],
        },
      },
      required: ["update_target", "order"],
    },
  },
  required: ["context", "message"],
};
