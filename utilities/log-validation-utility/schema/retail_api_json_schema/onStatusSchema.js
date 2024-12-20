const onStatusRules = require("./onStatusValidations");

module.exports = {
  type: "object",
  properties: {
    id: { type: "string" },
    state: {
      type: "string",
      enum: ["Created", "Accepted", "In-progress", "Completed", "Cancelled"],
    },
    provider: {
      type: "object",
      properties: {
        id: { type: "string" },
        locations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
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
          id: { type: "string" },
          fulfillment_id: { type: "string" },
          quantity: {
            type: "object",
            properties: {
              count: { type: "integer" },
            },
            required: ["count"],
          },
          tags: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: [
                  "Return_Initiated",
                  "Return_Approved",
                  "Return_Rejected",
                  "Return_Picked",
                  "Return_Delivered",
                  "Liquidated",
                  "Cancelled",
                ],
                errorMessage: `tags should only be used for part returned/cancelled items`,
              },
            },
            required: ["status"],
          },
        },
        required: ["id", "quantity", "fulfillment_id"],
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
        },
        updated_at: {
          type: "string",
          format: "date-time",
        },
      },
      required: ["name", "address", "phone", "created_at", "updated_at"],
    },

    fulfillments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          "@ondc/org/provider_name": { type: "string" },
          state: {
            type: "object",
            properties: {
              descriptor: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    enum: [
                      "Pending",
                      "Packed",
                      "Order-picked-up",
                      "Out-for-delivery",
                      "Order-delivered",
                      "RTO-Initiated",
                      "RTO-Delivered",
                      "RTO-Disposed",
                      "Cancelled",
                    ],
                  },
                },
                required: ["code"],
              },
            },
            required: ["descriptor"],
          },
          type: {
            type: "string",
            enum: ["Delivery", "Self-Pickup", "Reverse QC"],
          },
          tracking: { type: "boolean" },
          start: {
            type: "object",
            properties: {
              location: {
                type: "object",
                properties: {
                  descriptor: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      images: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                    required: ["name"],
                  },
                  gps: { type: "string" },
                },
                required: ["descriptor", "gps"],
              },
              time: {
                type: "object",
                properties: {
                  range: {
                    type: "object",
                    properties: {
                      start: {
                        type: "string",
                        format: "date-time",
                      },
                      end: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                    required: ["start", "end"],
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
                required: ["range"],
              },
              instructions: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  short_desc: { type: "string" },
                },
              },
              contact: {
                type: "object",
                properties: {
                  phone: { type: "string", minLength: 10, maxLength: 11 },
                  email: { type: "string" },
                },
                required: ["phone"],
              },
            },
            required: ["location", "time", "contact"],
          },
          end: {
            type: "object",
            properties: {
              location: {
                type: "object",
                properties: {
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
                  gps: { type: "string" },
                },
                required: ["address", "gps"],
              },
              time: {
                type: "object",
                properties: {
                  range: {
                    type: "object",
                    properties: {
                      start: {
                        type: "string",
                        format: "date-time",
                      },
                      end: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                    required: ["start", "end"],
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
                required: ["range"],
              },
              instructions: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  short_desc: { type: "string" },
                },
              },
              contact: {
                type: "object",
                properties: {
                  phone: { type: "string", minLength: 10, maxLength: 11 },
                },
                required: ["phone"],
              },
            },
            required: ["location", "time", "contact"],
          },
        },
        required: [
          "id",
          "@ondc/org/provider_name",
          "state",
          "type",
          "start",
          "end",
        ],
        if: {
          properties: {
            type: {
              type: "string",
              const: "Delivery",
            },
          },
        },
        then: {
          allOf: onStatusRules.timeRules,
        },
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
                      currency: { type: "string", pattern: "^(?!s*$).+" },
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
            anyOf: [
              {
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
                  // {
                  //   if: {
                  //     properties: {
                  //       settlement_type: {
                  //         const: "neft",
                  //       },
                  //     },
                  //   },
                  //   then: {
                  //     required: [
                  //       "settlement_ifsc_code",
                  //       "settlement_bank_account_no",
                  //       "bank_name",
                  //       "branch_name",
                  //     ],
                  //   },
                  // },
                ],
                required: [
                  "settlement_counterparty",
                  "settlement_phase",
                  "settlement_type",
                ],
              },
              {
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
                    enum: ["upi", "neft", "rtgs"],
                  },
                  settlement_amount: {
                    type: "string",
                  },
                  settlement_timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
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
      // allOf: [
      //   {
      //     if: {
      //       properties: {
      //         status: {
      //           const: "PAID",
      //         },
      //       },
      //       atPath: "1",
      //     },
      //     then: { properties: { type: { const: "ON-ORDER" } } },
      //   },
      // ],
    },

    tags: {
      type: "object",
      properties: {
        cancellation_reason_id: {
          type: "string",
          maxLength: 3,
          minLength: 3,
        },
      },
    },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
  allOf: onStatusRules.invoiceRules,
  required: [
    "payment",
    "fulfillments",
    "quote",
    "items",
    "id",
    "state",
    "provider",
    "billing",
    "created_at",
    "updated_at",
  ],
};
