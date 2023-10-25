module.exports = {
  $id: "http://example.com/schema/selectSchema",
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
                  const: { $data: "/search/0/context/location/city/code" },
                },
              },
              required: ["code"],
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  const: { $data: "/search/0/context/location/country/code" },
                },
              },
              required: ["code"],
            },
          },
          required: ["city", "country"],
        },
        action: {
          type: "string",
          const: "select",
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
        "bpp_id",
        "bpp_uri",
        "transaction_id",
        "message_id",
        "timestamp",
        "ttl",
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
                },
                locations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                    },
                    required: ["id"],
                  },
                },
                ttl: {
                  type: "string",
                  format: "duration"
                },
              },
              required: ["id", "locations"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  location_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  quantity: {
                    type: "object",
                    properties: {
                      selected: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                        },
                        required: ["count"],
                      },
                    },
                    required: ["selected"],
                  },
                  "add-ons": {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                      },
                      required: ["id"],
                    },
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string"
                            },
                          },
                          required: ["code"],
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              descriptor: {
                                type: "object",
                                properties: {
                                  code: {
                                    type: "string"
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
                required: ["id", "location_ids", "quantity"],
              },
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
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
                              pattern: "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
                              errorMessage: "Incorrect gps value",
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
                  customer: {
                    type: "object",
                    properties: {
                      person: {
                        type: "object",
                        properties: {
                          creds: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string",
                                },
                                type: {
                                  type: "string",
                                  enum: [
                                    "License",
                                    "Badge",
                                    "Permit",
                                    "Certificate",
                                  ],
                                },
                                desc: {
                                  type: "string",
                                },
                                icon: {
                                  type: "string",
                                },
                                url: {
                                  type: "string",
                                  pattern:
                                    "^https://[\\w.-]+(\\.[a-zA-Z]{2,})?(:[0-9]+)?(/\\S*)?$",
                                },
                              },
                              required: ["id", "type", "desc", "url"],
                            },
                          },
                        },
                        required: ["creds"],
                      },
                    },
                    required: ["person"],
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              enum: ["DELIVERY_TERMS"],
                            },
                          },
                          required: ["code"],
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              descriptor: {
                                type: "object",
                                properties: {
                                  code: {
                                    type: "string",
                                    enum: [
                                      "INCOTERMS",
                                      "NAMED_PLACE_OF_DELIVERY",
                                    ],
                                  },
                                },
                                required: ["code"],
                              },
                              value: {
                                type: "string",
                              },
                            },
                            if: {
                              properties: {
                                descriptor: {
                                  properties: { code: { const: "INCOTERMS" } },
                                },
                              },
                            },
                            then: {
                              properties: {
                                value: {
                                  enum: [
                                    "DPU",
                                    "CIF",
                                    "EXW",
                                    "FOB",
                                    "DAP",
                                    "DDP",
                                  ],
                                },
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
                required: ["stops"],
              },
            },
            payments: {
              type: "array",
              items: {
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
            },
            tags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  descriptor: {
                    properties: {
                      code: {
                        type: "string",
                        enum: ["buyer_id", "COMM_CHANNEL"],
                      },
                    },
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
                              enum: [
                                "buyer_id_code",
                                "buyer_id_no",
                                "chat_url",
                              ],
                            },
                          },
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
          additionalProperties:false,
          required: ["provider", "items", "fulfillments", "payments", "tags"],
        },
      },
      required: ["order"],
      additionalProperties:false,
    },
  },
  required: ["context", "message"],
  additionalProperties:false,
};
