module.exports = {
  $id: "http://example.com/schema/searchSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "ONDC:RET10",
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
          const: "2.0.1",
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
          const: "PT30S",
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
                category: {
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
            fulfillment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["Delivery", "Self-Pickup", "Delivery and Self-Pickup"],
                },
                stops: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                          },
                          area_code: {
                            type: "string",
                          },
                        },
                        required: ["gps", "area_code"],
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
                  enum: [
                    "PRE-FULFILLMENT",
                    "ON-FULFILLMENT",
                    "POST-FULFILLMENT",
                  ],
                },
              },
              required: ["type"],
            },
            tags: {
              type: "array",
              minItems: 2,
              uniqueItems: true,
              items: {
                type: "object",
                properties: {
                  descriptor: {
                    properties: {
                      code: {
                        type: "string",
                        enum: ["bap_terms", "buyer_id"],
                      },
                    },
                    required:["code"]
                  },
                  list: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          properties: {
                            code: {
                              type: "string",
                            },
                          },
                          required:["code"]
                        },
                        value: {
                          type: "string",
                        },
                      },
                      required: ["descriptor", "value"],
                    },
                    minItems: 2,
                  },
                },
                required: ["descriptor", "list"],
                if: {
                  properties: {
                    descriptor: {
                      properties: { code: { const: "bap_terms" } },
                    },
                  },
                },
                then: {
                  properties: {
                    list: {
                      items: {
                        type: "object",
                        properties: {
                          descriptor: {
                            properties: {
                              code: {
                                enum: ["finder_fee_type", "finder_fee_amount"],
                              },
                            },
                          },
                        },
                        required: ["descriptor"],
                      },
                    },
                  },
                  errorMessage:
                    "For 'bap_terms', the 'list' must contain either 'finder_fee_type' or 'finder_fee_amount'.",
                },
                else: {
                  if: {
                    properties: {
                      descriptor: {
                        properties: { code: { const: "buyer_id" } },
                      },
                    },
                  },
                  then: {
                    properties: {
                      list: {
                        items: {
                          type: "object",
                          properties: {
                            descriptor: {
                              properties: {
                                code: {
                                  enum: ["buyer_id_code", "buyer_id_no"],
                                },
                              },
                            },
                          },
                          required: ["descriptor"],
                        },
                      },
                    },
                    errorMessage:
                      "For 'buyer_id', the 'list' must contain either 'buyer_id_code' or 'buyer_id_no'.",
                  },
                },
              },
            },
          },
          additionalProperties:false,
          required: ["item", "fulfillment", "payment", "tags"],
        },
      },
      required: ["intent"],
    },
  },
  required: ["context", "message"],
};
