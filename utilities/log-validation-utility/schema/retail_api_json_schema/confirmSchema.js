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
          const: "confirm",
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
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            state: {
              type: "string",
              const: "Created",
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                locations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                    },
                    required: ["id"],
                  },
                },
              },
              required: ["id", "locations"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  fulfillment_id: {
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
                },
                required: ["id", "fulfillment_id", "quantity"],
              },
            },
            billing: {
              type: "object",
              properties: {
                name: { type: "string" },
                address: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    building: { type: "string" },
                    locality: { type: "string" },
                    city: { type: "string" },
                    state: { type: "string" },
                    country: { type: "string" },
                    area_code: { type: "string" },
                  },
                  required: [
                    "name",
                    "building",
                    "locality",
                    "city",
                    "state",
                    "country",
                    "area_code",
                  ],
                },
                email: { type: "string", format: "email" },
                phone: { type: "string", minLength: 10, maxLength: 11 },
                created_at: {
                  type: "string",
                  format: "date-time",
                  // pattern: "^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}.d{3}Z$",
                },
                updated_at: {
                  type: "string",
                  format: "date-time",
                  // pattern: "^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}.d{3}Z$",
                },
              },
              required: [
                "name",
                "address",
                "phone",
                "created_at",
                "updated_at",
              ],
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                    const: "Delivery",
                  },
                  tracking: {
                    type: "boolean",
                  },
                  end: {
                    type: "object",
                    properties: {
                      person: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                        },
                        required: ["name"],
                      },
                      contact: {
                        type: "object",
                        properties: {
                          email: {
                            type: "string",
                            format: "email",
                          },
                          phone: {
                            type: "string",
                            minLength: 10,
                            maxLength: 11,
                          },
                        },
                        required: ["phone"],
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                              },
                              building: {
                                type: "string",
                              },
                              locality: {
                                type: "string",
                              },
                              city: {
                                type: "string",
                              },
                              state: {
                                type: "string",
                              },
                              country: {
                                type: "string",
                              },
                              area_code: {
                                type: "string",
                              },
                            },
                            required: [
                              "name",
                              "building",
                              "locality",
                              "city",
                              "state",
                              "country",
                              "area_code",
                            ],
                          },
                        },
                        required: ["gps", "address"],
                      },
                    },
                    required: ["person", "contact", "location"],
                  },
                },
                required: ["id", "type", "end"],
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
                          price: {
                            type: "object",
                            properties: {
                              value: {
                                type: "string",
                                minLength: 1,
                                pattern: "^(\\d*.?\\d{1,2})$",
                              },
                              currency: {
                                type: "string",
                                pattern: "^(?!s*$).+",
                              },
                            },
                            required: ["value", "currency"],
                          },
                        },
                        required: ["price"],
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
            payment: {
              type: "object",
              properties: {
                status: { type: "string", const: "PAID" },
                type: { type: "string", const: "ON-ORDER" },
                collected_by: { type: "string", const: "BAP" },
                params: {
                  type: "object",
                  properties: {
                    amount: { type: "string", pattern: "^(\\d*.?\\d{1,2})$" },
                    transaction_id: { type: "string" },
                    currency: { type: "string" },
                  },
                  required: ["amount", "currency", "transaction_id"],
                },
                "@ondc/org/buyer_app_finder_fee_type": {
                  type: "string",
                  enum: ["percent", "amount"],
                },
                "@ondc/org/buyer_app_finder_fee_amount": {
                  type: "string",
                  pattern: "^(\\d*.?\\d{1,2})$",
                },
                "@ondc/org/settlement_details": {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      settlement_counterparty: {
                        type: "string",
                      },
                      settlement_phase: {
                        type: "string",
                      },
                      settlement_type: {
                        type: "string",
                        enum: ["upi", "neft", "rtgs"],
                      },
                      upi_address: { type: "string" },
                      settlement_bank_account_no: {
                        type: "string",
                      },
                      settlement_ifsc_code: {
                        type: "string",
                      },
                      bank_name: { type: "string" },
                      beneficiary_name: {
                        type: "string",
                      },
                      branch_name: { type: "string" },
                    },
                    allOf: [
                      {
                        if: {
                          properties: {
                            settlement_type: {
                              const: "upi",
                            },
                          },
                        },
                        then: {
                          properties: {
                            upi_address: {
                              type: "string",
                            },
                          },
                          required: ["upi_address"],
                        },
                      },
                      {
                        if: {
                          properties: {
                            settlement_type: {
                              enum: ["rtgs", "neft"],
                            },
                          },
                        },
                        then: {
                          properties: {
                            settlement_bank_account_no: {
                              type: "string",
                            },
                            settlement_ifsc_code: {
                              type: "string",
                            },
                            bank_name: { type: "string" },
                            branch_name: { type: "string" },
                          },
                          required: [
                            "settlement_ifsc_code",
                            "settlement_bank_account_no",
                            "bank_name",
                            "branch_name",
                          ],
                        },
                      },
                    ],
                    required: [
                      "settlement_counterparty",
                      "settlement_phase",
                      "settlement_type",
                    ],
                  },
                },
              },
              required: [
                "status",
                "type",
                "params",
                "collected_by",
                "@ondc/org/buyer_app_finder_fee_type",
                "@ondc/org/buyer_app_finder_fee_amount",
                "@ondc/org/settlement_details",
              ],
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "state",
            "provider",
            "items",
            "billing",
            "fulfillments",
            "quote",
            "payment",
            "created_at",
            "updated_at",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
