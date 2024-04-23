const constants = require("../../../utils/constants");

module.exports = {
  $id: "http://example.com/schema/onCancelSchema",
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
          const: "on_cancel",
        },
        version: {
          type: "string",
          const: "2.0.0",
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
            id: {
              type: "string",
              const: { $data: "/confirm/0/message/order/id" },
            },
            status: {
              type: "string",
              enum: ["Cancelled"],
            },
            cancellation: {
              type: "object",
              properties: {
                reason: {
                  type: "object",
                  properties: {
                    descriptor: {
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
                cancelled_by: {
                  type: "string",
                },
              },
              required: ["reason", "cancelled_by"],
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
                },
                required: [
                  "id",
                  "fulfillment_ids",
                  "quantity",
                ],
              },
            },
            billing: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/name" },
                },
                address: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/address" },
                },
                state: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/state/name",
                      },
                    },
                  },
                  required: ["name"],
                },
                city: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/city/name",
                      },
                    },
                  },
                  required: ["name"],
                },
                tax_id: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/tax_id" },
                },
                email: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/email" },
                },
                phone: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/phone" },
                },
              },

              required: ["name", "address", "state", "city", "phone"],
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
                            enum: ["Cancelled"],
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
                            address: {
                              type: "string",
                            },
                            city: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                },
                              },
                              required: ["name"],
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
                            area_code: {
                              type: "string",
                            },
                            state: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                },
                              },
                              required: ["name"],
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
                            timestamp: {
                              type: "string",
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
                          required: ["phone", "email"],
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
                },
                required: ["id", "type", "tracking", "state", "stops"],
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
                                    type: "integer",
                                  },
                                },
                                required: ["count"],
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
              required: ["price", "breakup", "ttl"],
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
                      "transaction_id",
                      "bank_account_number",
                      "virtual_payment_address",
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

            created_at: {
              type: "string",
              format: "date-time",
              const: { $data: "/confirm/0/message/order/created_at" },
              errorMessage:
                "should remain same as in /confirm - ${/confirm/0/message/order/created_at}",
            },

            updated_at: {
              type: "string",
              format: "date-time",
              not: { const: { $data: "/confirm/0/message/order/created_at" } },
              errorMessage: "should not be same as 'created_at'",
            },
          },
          required: [
            "id",
            "status",
            "provider",
            "items",
            "billing",
            "fulfillments",
            "quote",
            "payments",
            "updated_at",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
