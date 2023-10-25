const constants = require("../../../utils/constants");
module.exports = {
  $id: "http://example.com/schema/onInitSchema",
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
          const: "on_init",
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
              const: { $data: "/init/0/context/message_id" },
              errorMessage:
                "Message ID for on_action API should be same as action API: ${/init/0/context/message_id}",
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
        order: {
          type: "object",
          properties: {
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: { $data: "/init/0/message/order/provider/id" },
                },
              },
              required: ["id"],
            },
            provider_location: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: {
                    $data: "/init/0/message/order/provider/locations/0/id",
                  },
                },
              },
            },

            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    const: { $data: "/init/0/message/order/items/0/id" },
                  },
                  fulfillment_id: {
                    type: "string",
                    const: {
                      $data: "/init/0/message/order/items/0/fulfillment_id",
                    },
                  },
                },
                required: ["id", "fulfillment_id"],
              },
            },
            quote: {
              type: "object",
              properties: {
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
                breakup: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      "@ondc/org/item_id": {
                        type: "string",
                      },
                      "@ondc/org/title_type": {
                        type: "string",
                        enum: constants.TITLE_TYPE,
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
                    },
                    required: [
                      "@ondc/org/item_id",
                      "@ondc/org/title_type",
                      "price",
                    ],
                  },
                },
                ttl: {
                  type: "string",
                  format: "duration",
                },
              },
              isQuoteMatching: true,
              errorMessage:
                "price is not matching with the total breakup price",
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
                            const: {
                              $data:
                                "/search/0/message/intent/fulfillment/start/location/gps",
                            },
                            errorMessage:
                              "does not match start location in search",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",

                                not: { const: { $data: "1/locality" } },
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
                      contact: {
                        type: "object",
                        properties: {
                          phone: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                            format: "email",
                          },
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
                          gps: {
                            type: "string",
                            const: {
                              $data:
                                "/search/0/message/intent/fulfillment/end/location/gps",
                            },
                            errorMessage:
                              "does not match end location in search",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                minLength: 3,
                                errorMessage: "cannot be equal to locality",
                              },
                              building: {
                                type: "string",
                                not: { const: { $data: "1/locality" } },
                                errorMessage: "cannot be equal to locality",
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
                      contact: {
                        type: "object",
                        properties: {
                          phone: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                            format: "email",
                          },
                        },
                        required: ["phone", "email"],
                      },
                    },
                    required: ["location", "contact"],
                  },
                },
                required: ["id", "type", "start", "end"],
              },
            },
            payment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: constants.PAYMENT_TYPE,
                },
                collected_by: {
                  type: "string",
                  enum: constants.PAYMENT_COLLECTEDBY,
                },

                "@ondc/org/settlement_details": {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      settlement_counterparty: {
                        type: "string",
                      },
                      settlement_type: {
                        type: "string",
                      },
                      beneficiary_name: {
                        type: "string",
                      },
                      upi_address: {
                        type: "string",
                      },
                      settlement_bank_account_no: {
                        type: "string",
                      },
                      settlement_ifsc_code: {
                        type: "string",
                      },
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
                          required: ["upi_address"],
                        },
                      },
                      {
                        if: {
                          properties: {
                            settlement_type: {
                              const: ["neft", "rtgs"],
                            },
                          },
                        },
                        then: {
                          required: [
                            "settlement_ifsc_code",
                            "settlement_bank_account_no",
                          ],
                        },
                      },
                    ],
                    required: ["settlement_counterparty", "settlement_type"],
                  },
                },
              },
              if: {
                properties: {
                  type: { enum: ["ON-ORDER", "POST-FULFILLMENT"] },
                },
              },
              then: {
                properties: {
                  collected_by: { const: "BAP" },
                },
              },
              else: {
                properties: {
                  collected_by: { const: "BPP" },
                },
              },

              required: ["type", "collected_by"],
            },
          },
          required: ["provider", "items", "quote", "payment", "fulfillments"],
          // anyOf: [
          //   {
          //     required: [
          //       "/on_search/0/message/catalog/bpp~1providers/0/locations",
          //       "provider_location",
          //     ],
          //     errorMessage:"provider/location is required in /init if it was returned in /on_search"
          //   },
          //   {
          //     not: {
          //       required: [
          //         "/on_search/0/message/catalog/bpp~1providers/0/locations",
          //       ],
          //     },
          //   },
          // ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
