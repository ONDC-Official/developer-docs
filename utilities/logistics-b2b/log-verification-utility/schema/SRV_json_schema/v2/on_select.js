module.exports = {
  $id: "http://example.com/schema/onSelectSchema",
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
          const: "on_select",
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
        bpp_id: {
          type: "string",
        },
        bpp_uri: {
          type: "string",
        },
        transaction_id: {
          type: "string",
          const: { $data: "/select/0/context/transaction_id" },
          errorMessage:
            "Transaction ID should be same across the transaction: ${/select/0/context/transaction_id}",
        },
        message_id: {
          type: "string",
          allOf: [
            {
              const: { $data: "/select/0/context/message_id" },
              errorMessage:
                "Message ID for on_action API should be same as action API: ${/select/0/context/message_id}",
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
        ttl: {
          type: "string",
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
                  const: { $data: "/select/0/message/order/provider/id" },
                },
              },
              required: ["id"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  fulfillment_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  id: {
                    type: "string",
                    const: { $data: "/select/0/message/order/items/0/id" },
                  },
                  parent_item_id: {
                    type: "string",
                    const: { $data: "/select/0/message/order/items/0/parent_item_id" },
                  },
                  location_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  time: {
                    type: "object",
                    properties: {
                      label: {
                        type: "string",
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
                        required: ["start", "end"],
                      },
                      schedule: {
                        type: "object",
                        properties: {
                          frequency: {
                            type: "string",
                          },
                          holidays: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          times: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                    required: ["label", "schedule"],
                  },
                },
                required: [
                  "fulfillment_ids",
                  "id",
                  "parent_item_id",
                  "location_ids",
                ],
              },
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  tracking: {
                    type: "boolean",
                  },
                  state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            enum:["Serviceable","Non-serviceable"]
                          },
                        },
                        required: ["code"],
                      },
                    },
                    required: ["descriptor"],
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
                        time: {
                          type: "object",
                          properties: {
                            label: {
                              type: "string",
                              enum: ["confirmed","rejected"]
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
                              required: ["start", "end"],
                            },
                          },
                          required: ["label", "range"],
                        },
                        tags: {
                          type: "object",
                          properties: {
                            descriptor: {
                              type: "object",
                              properties: {
                                code: {
                                  type: "string",
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
                      required: ["type", "location", "time", "tags"],
                    },
                  },
                },
                required: ["id", "state", "stops"],
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
                      title: {
                        type: "string",
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
                      item: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          quantity: {
                            type: "object",
                            properties: {
                              selected: {
                                type: "object",
                                properties: {
                                  count: {
                                    type: "string",
                                  },
                                },
                                required: ["count"],
                              },
                              measure: {
                                type: "object",
                                properties: {
                                  unit: {
                                    type: "string",
                                  },
                                  value: {
                                    type: "string",
                                  },
                                },
                                required: ["unit", "value"],
                              },
                            },
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
                        required: ["id", "quantity", "price"],
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
                    required: ["title", "price", "item", "tags"],
                  },
                },
                ttl: {
                  type: "string",
                },
              },
              isQuoteMatching:true,
              required: ["price", "breakup", "ttl"],
            },
            payments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    const: { $data: "/select/0/message/order/payments/0/type" },
                  },
                  collected_by: {
                    type: "string",
                    enum:["BAP","BPP"]
                  },
                },
                required: ["type","collected_by"],
              },
            },
          },
          required: ["provider", "items", "fulfillments", "quote","payments"],
        },
      },
      required: ["order"],
    },
    error: {
      type: "object",
      properties: {
        code: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
      required: ["code", "message"],
    },
  },
  required: ["context", "message"],
};
