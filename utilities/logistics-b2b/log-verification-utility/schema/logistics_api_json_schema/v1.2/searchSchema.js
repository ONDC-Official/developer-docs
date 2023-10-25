const constants = require("../../../utils/constants");
module.exports = {
  $id: "http://example.com/schema/searchSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "nic2004:60232",
        },
        country: {
          type: "string",
        },
        city: {
          type: "string",
        },
        action: {
          type: "string",
          const: "search",
        },
        core_version: {
          type: "string",
          const: "1.2.0",
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
          allOf: [
            {
              not: {
                const: { $data: "1/transaction_id" },
              },
              errorMessage:
                "Message ID should not be equal to transaction_id: ${1/transaction_id}",
            },
          ],
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string",
          const: "PT30S",
        },
      },
      required: [
        "domain",
        "country",
        "city",
        "action",
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
            category: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  enum: constants.CATEGORY_ID,
                },
              },
              required: ["id"],
            },
            provider: {
              type: "object",
              properties: {
                time: {
                  type: "object",
                  properties: {
                    days: {
                      type: "string",
                      pattern: "^(?!.*(\\d).*\\1)[1-7](?:,[1-7])*(?![1-7])$",
                      errorMessage:
                        "Days format not correct. Ref footnote 9 of 1.1",
                    },
                    schedule: {
                      type: "object",
                      properties: {
                        holidays: {
                          type: "array",
                          items: {
                            type: "string",
                            format: "date",
                          },
                        },
                      },
                      required: ["holidays"],
                    },
                    range: {
                      type: "object",
                      properties: {
                        start: {
                          type: "string",
                          pattern: "^(?:[01][0-9]|2[0-3])[0-5][0-9]$",
                        },
                        end: {
                          type: "string",
                          pattern: "^(?:[01][0-9]|2[0-3])[0-5][0-9]$",
                        },
                      },
                      isEndTimeGreater: true,
                      errorMessage:
                        'The "end" time must be greater than the "start" time',
                      required: ["start", "end"],
                    },
                  },
                  required: ["days", "schedule", "range"],
                },
              },
            },
            fulfillment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: constants.FULFILLMENT_TYPE,
                },
                start: {
                  type: "object",
                  properties: {
                    location: {
                      type: "object",
                      properties: {
                        gps: {
                          type: "string",
                          pattern:
                            "^(-?[0-9]{1,3}(?:.[0-9]{1,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{1,15})?)$",
                          errorMessage: "Incorrect gps value",
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
                      required: ["gps", "address"],
                    },
                  },
                  required: ["location"],
                },
                end: {
                  type: "object",
                  properties: {
                    location: {
                      type: "object",
                      properties: {
                        gps: {
                          type: "string",
                          pattern:
                            "^(-?[0-9]{1,3}(?:.[0-9]{1,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{1,15})?)$",
                          allOf: [
                            {
                              not: {
                                const: { $data: "3/start/location/gps" },
                              },
                              errorMessage:
                                "cannot be equal to start/location/gps '${3/start/location/gps}'",
                            },
                          ],
                          errorMessage: "Incorrect gps value",
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
                      required: ["gps", "address"],
                    },
                  },
                  required: ["location"],
                },
              },
              required: ["type", "start", "end"],
            },
            payment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: constants.PAYMENT_TYPE,
                },
                "@ondc/org/collection_amount": {
                  type: "string",
                },
              },
              required: ["type"],
              // if: { properties: { type: { const: "ON-FULFILLMENT" } } },
              // then: {
              //   required: ["@ondc/org/collection_amount", "type"],
              //   errorMessage:
              //     "@ondc/org/collection_amount is required for payment type 'ON-FULFILLMENT'",
              // },
              // else: { required: ["type"] }
              allOf: [
                {
                  if: {
                    properties: { type: { const: "ON-FULFILLMENT" } },
                  },
                  then: {
                    required: ["@ondc/org/collection_amount"],
                  },
                },
                {
                  if: {
                    properties: {
                      type: { enum: ["ON-ORDER", "POST-FULFILLMENT"] },
                    },
                  },
                  then: {
                    not: { required: ["@ondc/org/collection_amount"] },
                    errorMessage:
                      "@ondc/org/collection_amount is required only for payment/type 'ON-FULFILLMENT'",
                  },
                },
              ],
            },
            "@ondc/org/payload_details": {
              type: "object",
              properties: {
                weight: {
                  type: "object",
                  properties: {
                    unit: {
                      type: "string",
                      enum: constants.UNITS_WEIGHT,
                    },
                    value: {
                      type: "number",
                      minimum: 0
                    },
                  },
                  required: ["unit", "value"],
                },
                dimensions: {
                  type: "object",
                  properties: {
                    length: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: constants.UNITS_DIMENSIONS,
                        },
                        value: {
                          type: "number",
                          minimum: 0
                        },
                      },
                      required: ["unit", "value"],
                    },
                    breadth: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: constants.UNITS_DIMENSIONS,
                        },
                        value: {
                          type: "number",
                          minimum: 0
                        },
                      },
                      required: ["unit", "value"],
                    },
                    height: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: constants.UNITS_DIMENSIONS,
                        },
                        value: {
                          type: "number",
                          minimum: 0
                        },
                      },
                      required: ["unit", "value"],
                    },
                  },
                  required: ["length", "breadth", "height"],
                },
                category: {
                  type: "string",
                  enum: constants.CATEGORIES,
                },
                dangerous_goods: {
                  type: "boolean",
                },
                value: {
                  type: "object",
                  properties: {
                    currency: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                    },
                  },
                  required: ["currency", "value"],
                },
              },
              required: ["weight", "category", "value"],
            },
          },
          required: [
            "category",
            "provider",
            "fulfillment",
            "@ondc/org/payload_details",
            "payment",
          ],
        },
      },
      required: ["intent"],
    },
  },

  required: ["context", "message"],
};
