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
          ]
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
            "bpp/fulfillments": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                    enum: ["Prepaid", "CoD", "RTO", "Reverse QC"],
                  },
                },
                required: ["id", "type"],
              },
            },
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
                          },
                          required: ["label", "duration"],
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
                        },
                        fulfillment_id: {
                          type: "string",
                        },
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum: ["P2P", "P2H2P"],
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
                              errorMessage: "${2/time/duration}",
                            },
                            timestamp: {
                              type: "string",
                              format: "date-time",
                            },
                          },
                          required: ["label", "duration", "timestamp"],
                        },
                      },
                      required: [
                        "id",
                        "category_id",
                        "fulfillment_id",
                        "descriptor",
                        "price",
                      ],
                    },
                  },
                },
                if: 
                  {
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
                  },
                  // {
                  //   not: {
                  //     properties: {
                  //       categories: {
                  //         type: "array",
                  //         items: {
                  //           type: "object",
                  //           properties: {
                  //             id: { const: "Immediate Delivery" },
                  //           },
                  //         },
                  //       },
                  //     },
                  //   },
                  // },
                else:{
                required: ["id", "descriptor", "categories", "items"],
                }
              },
            },
          },
          additionalProperties:false,
          required: ["bpp/fulfillments", "bpp/descriptor", "bpp/providers"],
        },
      },
      required: ["catalog"],
    },
  },

  search: {
    type: "array",
    items: {
      $ref: "searchSchema#",
    },
  },

  required: ["context", "message"],
};
