const { error } = require("ajv/dist/vocabularies/applicator/dependencies");
const constants = require("../../../utils/constants");

module.exports = {
  $id: "http://example.com/schema/onSearchSchema",
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
          const: { $data: "/search/0/context/city" },
        },
        action: {
          type: "string",
          const: "on_search",
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
        bpp_id: {
          type: "string",
        },
        bpp_uri: {
          type: "string",
        },
        transaction_id: {
          type: "string",
          const: { $data: "/search/0/context/transaction_id" },
          errorMessage:
            "Transaction ID should be same across the transaction: ${/search/0/context/transaction_id}",
        },
        message_id: {
          type: "string",
          allOf: [
            {
              const: { $data: "/search/0/context/message_id" },
              errorMessage:
                "Message ID for on_action API should be same as action API: ${/search/0/context/message_id}",
            },
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
      },
      required: [
        "domain",
        "country",
        "city",
        "action",
        "core_version",
        "bap_id",
        "bap_uri",
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "timestamp",
      ],
    },
    message: {
      type: "object",
      properties: {
        catalog: {
          type: "object",
          properties: {
            "bpp/descriptor": {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
              },
              required: ["name"],
            },
            "bpp/providers": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                      short_desc: {
                        type: "string",
                      },
                      long_desc: {
                        type: "string",
                      },
                    },
                    required: ["name", "short_desc", "long_desc"],
                  },
                  categories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          enum: constants.CATEGORY_ID,
                        },
                        time: {
                          type: "object",
                          properties: {
                            label: {
                              type: "string",
                              const: "TAT",
                            },
                            duration: {
                              type: "string",
                              format: "duration",
                            },
                            timestamp: {
                              type: "string",
                              format: "date",
                            },
                          },
                          required: ["label", "duration", "timestamp"],
                        },
                      },
                      required: ["id"],
                      anyOf: [
                        {
                          properties: {
                            id: { const: "Immediate Delivery" },
                            time: {
                              type: "object",
                              properties: {
                                duration: {
                                  type: "string",
                                  pattern: "^PT([1-5][1-9]|60)?M$",
                                  errorMessage:
                                    "Duration is not correct as per Immediate Delivery",
                                },
                              },
                              required: ["label", "duration"],
                            },
                          },
                          required: ["id", "time"],
                        },
                        {
                          not: {
                            properties: {
                              id: { const: "Immediate Delivery" },
                              time: {
                                type: "object",
                                properties: {
                                  duration: {
                                    type: "string",
                                    pattern: "^PT([1-5][1-9]|60)?M$",
                                  },
                                },
                                required: ["label", "duration"],
                              },
                            },
                            required: ["id", "time"],
                          },
                        },
                      ],
                    },
                  },
                  locations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        gps: {
                          type: "string",
                        },
                        address: {
                          type: "object",
                          properties: {
                            street: {
                              type: "string",
                            },
                            city: {
                              type: "string",
                            },
                            area_code: {
                              type: "string",
                            },
                            state: {
                              type: "string",
                            },
                          },
                          required: ["street", "city", "area_code", "state"],
                        },
                      },
                      required: [],
                    },
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        parent_item_id: {
                          type: "string",
                        },
                        category_id: {
                          type: "string",
                          enum: constants.CATEGORY_ID,
                        },
                        fulfillment_id: {
                          type: "string",
                        },
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum: constants.SHIPMENT_TYPE,
                            },
                            name: {
                              type: "string",
                            },
                            short_desc: {
                              type: "string",
                            },
                            long_desc: {
                              type: "string",
                            },
                          },
                          required: ["code", "name", "short_desc", "long_desc"],
                          // if: { properties: { code: { const: "P2H2P" } } },
                          // then: {
                          //   required: [
                          //     "/search/0/message/intent/@ondc~1org~1payload_details/dimensions",
                          //   ],
                          //   errorMessage:
                          //     "dimensions are required in /search for P2H2P shipments ${/search/0/message/intent/@ondc~1org~1payload_details/dimensions}",
                          // },
                        },
                        price: {
                          type: "object",
                          properties: {
                            currency: {
                              type: "string",
                            },
                            value: {
                              type: "string",
                              pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
                              errorMessage:
                                "precision for all prices in quote can be maximum of 2 decimal digits",
                            },
                          },
                          required: ["currency", "value"],
                        },
                        time: {
                          type: "object",
                          properties: {
                            label: {
                              type: "string",
                              const: "TAT",
                            },
                            duration: {
                              type: "string",
                              format: "duration",
                            },
                            timestamp: {
                              type: "string",
                              format: "date",
                            },
                          },
                          required: ["label", "duration", "timestamp"],
                        },
                      },
                      additionalProperties:false,
                      required: [
                        "id",
                        "parent_item_id",
                        "category_id",
                        "fulfillment_id",
                        "descriptor",
                        "price",
                      ],
                    },
                  },
                  fulfillments: {
                    type: "array",
                    minItems:1,
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        type: {
                          type: "string",
                          enum: constants.FULFILLMENT_TYPE,
                        },
                        start: {
                          type: "object",
                          properties: {
                            time: {
                              type: "object",
                              properties: {
                                duration: {
                                  type: "string",
                                },
                              },
                              required: ["duration"],
                            },
                          },
                          required: ["time"],
                        },
                        tags: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: ["distance"]
                              },
                              list: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    code: {
                                      type: "string",
                                      enum: ["motorable_distance_type","motorable_distance"]
                                    },
                                    value: {
                                      type: "string",
                                    },
                                  },
                                  required: ["code", "value"],
                                },
                              },
                            },
      
                            required: ["code", "list"],
                          },
                        },
                      },
                      additionalProperties:false,
                      required: ["id", "type"],
                    },
                  },
                },
                if: {
                  properties: {
                    categories: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { const: "Immediate Delivery" },
                        },
                      },
                    },
                  },
                  not: {
                    required: ["locations"],
                  },
                  errorMessage:
                    "Locations is only required when shipment has to be dropped off at LSP location; not required for P2P",
                },

                required: [
                  "id",
                  "descriptor",
                  "categories",
                  "items",
                  "fulfillments",
                ],
              },
            },
          },
          additionalProperties: false,
          required: ["bpp/descriptor", "bpp/providers"],
        },
      },
      required: ["catalog"],
    },
  },

  required: ["context", "message"],
};
