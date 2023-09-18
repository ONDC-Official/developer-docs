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
          allOf: [
            {
              not: {
                const: { $data: "1/transaction_id" },
              },
              errorMessage:
                "Message ID should not be equal to transaction_id: ${1/transaction_id}",
            }
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
                  enum: [
                    "Express Delivery",
                    "Standard Delivery",
                    "Immediate Delivery",
                    "Same Day Delivery",
                    "Next Day Delivery",
                  ],
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
                        frequency: {
                          type: "string",
                          format: "duration",
                        },
                        times: {
                          type: "array",
                          items: {
                            type: "string",
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
                        },
                        end: {
                          type: "string",
                        },
                      },
                    },
                  },
                  oneOf: [
                    {
                      properties: {
                        schedule: {
                          type: "object",
                          required: ["times", "frequency"],
                        },
                      },
                      required: ["schedule"],
                    },
                    {
                      type: "object",
                      required: ["range"],
                    },
                  ],
                  errorMessage:
                    "Both range and schedule cannot be present in time",
                },
              },
            },
            fulfillment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["CoD", "Prepaid", "Reverse QC"],
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
                "@ondc/org/collection_amount": {
                  type: "string",
                },
              },
              required: ["@ondc/org/collection_amount"],
            },
            "@ondc/org/payload_details": {
              type: "object",
              properties: {
                weight: {
                  type: "object",
                  properties: {
                    unit: {
                      type: "string",
                      enum: ["Kilogram", "Gram"],
                    },
                    value: {
                      type: "number",
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
                          enum: ["centimeter", "meter"],
                        },
                        value: {
                          type: "number",
                        },
                      },
                      required: ["unit", "value"],
                    },
                    breadth: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: ["centimeter", "meter"],
                        },
                        value: {
                          type: "number",
                        },
                      },
                      required: ["unit", "value"],
                    },
                    height: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: ["centimeter", "meter"],
                        },
                        value: {
                          type: "number",
                        },
                      },
                      required: ["unit", "value"],
                    },
                  },
                  required: ["length", "breadth", "height"],
                },
                category: {
                  type: "string",
                  enum: [
                    "Grocery",
                    "F&B",
                    "Fashion",
                    "BPC",
                    "Electronics",
                    "Home & Decor",
                    "Pharma",
                    "Agriculture",
                    "Mobility",
                  ],
                },
                dangerous_goods: {
                  type: "boolean"
                  // const: "true",
                  // errorMessage:
                  //     "is an optional property and should be set when payload includes hazardous goods",
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
          ],
          // if: {
          //   properties: {
          //     code: { const: "P2H2P" },
          //   },
          // },
          // then: {
          //   required: [
          //     "/search/0/message/intent/@ondc~1org~1payload_details/dimensions",
          //   ],
          //   errorMessage:
          //     "dimensions are required for inter-city shipments in /search",
          // },
          if: {
            properties: {
              fulfillment: { properties: { type: { const: "CoD" } } },
            },
          },
          then: {
            required: ["payment"],
            errorMessage:
              "Payment object is required for fulfillment type 'CoD'",
          },
        },
      },
      required: ["intent"],
    },
  },

  required: ["context", "message"],
};
