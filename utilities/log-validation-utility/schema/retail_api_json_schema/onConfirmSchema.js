module.exports = {
  type: "object",
  properties: {
    id: { type: "string" },
    state: { type: "string", enum: ["Created", "Accepted", "Cancelled"] },
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
        rateable: { type: "boolean" },
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
          // pattern: "^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}.d{3}Z$",
        },
        updated_at: {
          type: "string",
          format: "date-time",
          // pattern: "^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}.d{3}Z$",
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
                  code: { type: "string", const: "Pending" },
                },
                required: ["code"],
              },
            },
            required: ["descriptor"],
          },
          type: { type: "string", const: "Delivery" },
          tracking: { type: "boolean" },
          start: {
            type: "object",
            properties: {
              location: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  descriptor: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                    },
                    required: ["name"],
                  },
                  gps: { type: "string" },
                },
                required: ["id", "descriptor", "gps"],
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
                    // required: ["start", "end"],
                  },
                },
                // required: ["range"],
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
            required: ["location", "contact"],
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
                    // required: ["start", "end"],
                  },
                },
                // required: ["range"],
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
            required: ["location", "contact"],
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
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
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
