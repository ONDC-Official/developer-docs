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
    provider_location: {
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
          id: { type: "string", pattern: "^(?!s*$).+" },
          fulfillment_id: { type: "string" },
          quantity: {
            type: "object",
            properties: {
              count: { type: "integer" },
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
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
      required: ["name", "address", "phone", "created_at", "updated_at"],
    },

    fulfillments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", const: "Delivery" },
          tracking: { type: "boolean" },
          end: {
            type: "object",
            properties: {
              location: {
                type: "object",
                properties: {
                  gps: { type: "string" },
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
                },
                required: ["gps", "address"],
              },
              contact: {
                type: "object",
                properties: {
                  phone: { type: "string", minLength: 10, maxLength: 11 },
                  email: { type: "string", format: "email" },
                },
                required: ["phone"],
              },
            },
            required: ["location", "contact"],
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
                const: "sale-amount",
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
        "@ondc/org/buyer_app_finder_fee_type",
        "@ondc/org/buyer_app_finder_fee_amount",
        "@ondc/org/settlement_details",
      ],
    },
  },
  required: [
    "payment",
    "fulfillments",
    "billing",
    "quote",
    "items",
    "provider",
    "provider_location",
  ],
};
