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
        },
        location: {
          type: "object",
          properties: {
            city: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
              required: ["code"],
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                },
              },
              required: ["code"],
            },
          },
          required: ["city", "country"],
        },
        action: {
          type: "string",
          const: "search",
        },
        version: {
          type: "string",
          const: "2.0.0"
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
          const: "PT30S"
        },
      },
      required: [
        "domain",
        "location",
        "action",
        "version",
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
            },
            category: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
              required: ["id"],
            },
            fulfillment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: constants.SRV_FULFILLMENT_TYPE
                },
                stops: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        const: "end"
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                            pattern: constants.GPS_PATTERN,
                            errorMessage: "Incorrect gps value (minimum of six decimal places are required)"
                          },
                          area_code: {
                            type: "string",
                          },
                        },
                        required: ["gps", "area_code"],
                      },
                      time: {
                        type: "object",
                        properties: {
                          range: {
                            type: "object",
                            properties: {
                              start: {
                                type: "string",
                                format: "date-time"
                              },
                              end: {
                                type: "string",
                                format: "date-time"
                              },
                            },
                            required: ["start", "end"],
                          },
                          days: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                        required: ["range"],
                      },
                    },
                    required: ["type", "location"],
                  },
                },
              },
              required: ["type", "stops"],
            },
            payment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: constants.SRV_PAYMENT_TYPE
                },
                collected_by: {
                  type: "string",
                  enum:  constants.PAYMENT_COLLECTEDBY
                },
              },
              required: ["type", "collected_by"],
            },
            tags: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                properties: {
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        enum: ["BAP_Terms"]
                      },
                    },
                    required: ["code"],
                  },
                  list: {
                    type: "array",
                    minItems: 2,
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum:["finder_fee_type","finder_fee_amount"]
                            },
                          },
                          required: ["code"],
                        },
                        value: {
                          type: "string",
                        },
                      },
                      required: ["descriptor", "value"],
                    },
                  },
                },
                required: ["descriptor", "list"],
              },
            },
          },
          required: [ "fulfillment", "tags"],
        },
      },
      required: ["intent"],
    },
  },
  required: ["context", "message"],
};
