module.exports = {
  $id: "http://example.com/schema/confirmSchema",
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
          const: "confirm",
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
          const: { $data: "/select/0/context/transaction_id" },
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
            id: {
              type: "string",
            },
            state: {
              type: "string",
              enum: ["Created"],
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: { $data: "/init/0/message/order/provider/id" },
                },
                locations: {
                  type: "array",
                  const: { $data: "/init/0/message/order/provider/locations" },
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
                              type: "string",
                              enum: ["BUYER_TERMS"],
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
                                    enum: ["ITEM_REQ", "PACKAGING_REQ"],
                                  },
                                },
                                required: ["code"],
                              },
                              value: {
                                type: "string",
                                anyOf: [
                                  {
                                    const: { $data: "/init/0/message/order/items/0/tags/0/list/0/value" },
                                  },
                                  {
                                    const: { $data: "/init/0/message/order/items/0/tags/0/list/1/value" },
                                  }
                                ]
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
                required: ["id", "fulfillment_ids", "quantity"],
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
              additionalProperties: false,
              required: ["name", "address", "state", "city", "tax_id", "phone"],
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
                  stops: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["start", "end"],
                        },
                        location: {
                          type: "object",
                          properties: {
                            gps: {
                              type: "string",
                              pattern: "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
                              errorMessage: "Incorrect gps value",
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
                          required: [
                            "gps",
                            "address",
                            "city",
                            "country",
                            "area_code",
                            "state",
                          ],
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
                        customer: {
                          type: "object",
                          properties: {
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
                          required: ["person"],
                        },
                      },
                      required: ["type", "location", "contact"],
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
                                anyOf: [
                                  {
                                    const: { $data: "/init/0/message/order/fulfillments/0/tags/0/list/0/value" },
                                  },
                                  {
                                    const: { $data: "/init/0/message/order/fulfillments/0/tags/0/list/1/value" },
                                  }
                                ]
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
                required: ["id", "type", "stops"],
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
                      const: {
                        $data: "/on_init/0/message/order/quote/price/value",
                      },
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
                      "@ondc/org/item_quantity": {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                        },
                        required: ["count"],
                      },
                      title: {
                        type: "string",
                      },
                      "@ondc/org/title_type": {
                        type: "string",
                        enum: ["item", "Discount", "Packing charges", "delivery ", "tax", "misc"]
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
                        required: ["price"],
                      },
                    },
                    if: {
                      properties: {
                        "@ondc/org/title_type": {
                          const: "item",
                        },
                      },
                    },
                    then: {
                      required: [
                        "@ondc/org/item_id",
                        "@ondc/org/item_quantity",
                        "title",
                        "@ondc/org/title_type",
                        "price",
                        "item",
                      ],
                    },
                    else: {
                      properties: {
                        "@ondc/org/title_type": {
                          enum: [
                            "delivery",
                            "packing",
                            "tax",
                            "discount",
                            "misc",
                          ],
                        },
                      },
                      required: [
                        "@ondc/org/item_id",
                        "title",
                        "@ondc/org/title_type",
                        "price",
                      ],
                    },
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
                  params: {
                    type: "object",
                    properties: {
                      currency: {
                        type: "string",
                      },
                      transaction_id: {
                        type: "string",
                      },
                      amount: {
                        type: "string",
                      },
                    },
                    required: ["currency", "amount"],
                  },
                  status: {
                    type: "string",
                    enum: ["PAID", "NOT-PAID"],
                  },
                  type: {
                    type: "string",
                    enum: [
                      "PRE-FULFILLMENT",
                      "ON-FULFILLMENT",
                      "POST-FULFILLMENT",
                    ],
                  },
                  collected_by: {
                    type: "string",
                  },
                  "@ondc/org/buyer_app_finder_fee_type": {
                    type: "string",
                  },
                  "@ondc/org/buyer_app_finder_fee_amount": {
                    type: "string",
                  },
                  "@ondc/org/settlement_details": {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        settlement_counterparty: {
                          type: "string",
                          enum: ["seller-app", "buyer-app"],
                        },
                        settlement_phase: {
                          type: "string",
                        },
                        settlement_type: {
                          type: "string",
                          enum: ["upi", "neft", "rtgs"],
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
                        beneficiary_name: {
                          type: "string",
                        },
                        bank_name: {
                          type: "string",
                        },
                        branch_name: {
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
                required: [
                  "params",
                  "status",
                  "type",
                  "collected_by",
                  "@ondc/org/buyer_app_finder_fee_type",
                  "@ondc/org/buyer_app_finder_fee_amount",
                ],
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
                        enum: ["buyer_id"],
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
                              enum: ["buyer_id_code", "buyer_id_no"],
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
            created_at: {
              type: "string",
              const: { $data: "3/context/timestamp" },
              errorMessage:
                "created_at does not match context timestamp - ${3/context/timestamp}",
            },
            updated_at: {
              type: "string",
              const: { $data: "3/context/timestamp" },
              errorMessage:
                "updated_at does not match context timestamp - ${3/context/timestamp}",
            },
          },
          additionalProperties:false,
          required: [
            "id",
            "state",
            "provider",
            "items",
            "billing",
            "fulfillments",
            "quote",
            "payments",
            "created_at",
            "updated_at",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
