module.exports = {
  $id: "http://example.com/schema/updateSchema",
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
          const: "update",
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
        update_target: {
          type: "string",
          enum: ["payments","fulfillments"]
        },
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              const: { $data: "/confirm/0/message/order/id" },
            },
            state: {
              type: "string",
            },
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
                  parent_item_id: {
                    type: "string",
                  },
                  fulfillment_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  location_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: [
                  "id",
                  "parent_item_id",
                  "fulfillment_ids",
                  "location_ids",
                ],
              },
            },
            payments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  collected_by: {
                    type: "string",
                  },
                  params: {
                    type: "object",
                    properties: {
                      amount: {
                        type: "string",
                      },
                      currency: {
                        type: "string",
                      },
                      transaction_id: {
                        type: "string",
                      },
                      bank_account_number: {
                        type: "string",
                      },
                      virtual_payment_address: {
                        type: "string",
                      },
                    },
                    required: [
                      "amount",
                      "currency",
                    ],
                  },
                  status: {
                    type: "string",
                  },
                  type: {
                    type: "string",
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
                required: [
                  "id",
                  "collected_by",
                  "params",
                  "status",
                  "type",
                  "tags",
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
                  state: {
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
                    },
                    required: ["descriptor"],
                  },
                  type: {
                    type: "string",
                  },
                  tracking: {
                    type: "boolean",
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
                            id: {
                              type: "string",
                            },
                            descriptor: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                },
                              },
                              required: ["name"],
                            },
                            gps: {
                              type: "string",
                            },
                          },
                          required: ["gps"],
                        },
                        time: {
                          type: "object",
                          properties: {
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
                          required: ["range"],
                        },
                        contact: {
                          type: "object",
                          properties: {
                            phone: {
                              type: "string",
                            },
                            email: {
                              type: "string",
                            },
                          },
                          required: ["phone"],
                        },
                        instructions: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                            short_desc: {
                              type: "string",
                            },
                          },
                          required: ["name", "short_desc"],
                        },
                        person: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                          },
                          required: ["name"],
                        },
                      },
                      required: [
                        "type",
                        "location",
                        "time",
                        "contact",
                        "person",
                      ],
                    },
                  },
                  rateable: {
                    type: "boolean",
                  },
                },
                required: ["id", "state", "type", "stops"],
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
                        required: ["id", "price"],
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
              required: ["price", "breakup", "ttl"],
            },
          },
          required: [
            "id",
            "status",
            "provider",
            "items",
            "payments",
            "fulfillments",
            "quote",
          ],
        },
      },
      required: ["update_target", "order"],
    },
  },
  required: ["context", "message"],
};
