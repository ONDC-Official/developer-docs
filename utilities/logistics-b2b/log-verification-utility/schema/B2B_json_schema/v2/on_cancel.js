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
          const: "on_cancel",
        },
        version: {
          type: "string",
          const: "2.0.2",
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
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string",
          const:"PT30S"
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
            state: {
              type: "string",
              enum: ["Cancelled"],
            },
            cancellation: {
              type: "object",
              properties: {
                reason: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                  },
                  required: ["id"],
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
                  const: { $data: "/select/0/message/order/provider/id" },
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
                  payment_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
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
                    additionalProperties: false,
                    required: ["selected"],
                  },
                },
                required: ["id", "fulfillment_ids", "quantity", "payment_ids"],
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
                    },
                    const: {
                      $data: "/init/0/message/order/billing/city/name",
                    },
                  },
                  required: ["name"],
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
                  "@ondc/org/provider_name": {
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
                          enum: ["start", "end"],
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
                                images: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                },
                              },
                              required: ["name"],
                            },
                            gps: {
                              type: "string",
                              pattern:
                                "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
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
                        },
                        time: {
                          type: "object",
                          properties: {
                            range: {
                              type: "object",
                              properties: {
                                start: {
                                  type: "string",
                                  pattern:
                                    "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                  errorMessage:
                                    "should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format",
                                },
                                end: {
                                  type: "string",
                                  pattern:
                                    "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                  errorMessage:
                                    "should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format",
                                },
                              },
                              required: ["start", "end"],
                            },
                            timestamp: {
                              type: "string",
                              pattern:
                                "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                              errorMessage:
                                "should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format",
                            },
                          },
                          required: ["range"],
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
                            long_desc: {
                              type: "string",
                            },
                            images: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                          },
                          required: [
                            "name",
                            "short_desc",
                            "long_desc",
                            "images",
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
                          required: ["phone"],
                        },
                        agent: {
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
                            contact: {
                              type: "object",
                              properties: {
                                phone: {
                                  type: "string",
                                },
                              },
                              required: ["phone"],
                            },
                          },
                          required: ["person", "contact"],
                        },
                      },
                      if: { properties: { type: { const: "start" } } },
                      then: {
                        properties: {
                          location: { required: ["id", "descriptor", "gps"] },
                        },
                      },
                      else: {
                        properties: {
                          location: { required: ["address", "gps"] },
                        },
                      },
                      required: ["type", "location", "contact"],
                    },
                  },
                },
                required: [
                  "id",
                  "@ondc/org/provider_name",
                  "type",
                  "tracking",
                  "state",
                  "stops",
                ],
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
                        enum: [
                          "item",
                          "discount",
                          "packing",
                          "delivery",
                          "tax",
                          "misc",
                          "refund",
                        ],
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
                  },
                },
                ttl: {
                  type: "string",
                },
              },
              isQuoteMatching: true,

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

                    const: {
                      $data: "/on_confirm/0/message/order/payments/0/type",
                    },
                  },
                  collected_by: {
                    type: "string",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/payments/0/collected_by",
                    },
                    enum: ["BAP", "BPP"],
                  },
                  "@ondc/org/buyer_app_finder_fee_type": {
                    type: "string",
                    const: {
                      $data:
                        "/confirm/0/message/order/payments/0/@ondc~1org~1buyer_app_finder_fee_type",
                    },
                  },
                  "@ondc/org/buyer_app_finder_fee_amount": {
                    type: "string",
                    const: {
                      $data:
                        "/confirm/0/message/order/payments/0/@ondc~1org~1buyer_app_finder_fee_amount",
                    },
                  },
                  "@ondc/org/settlement_basis": {
                    type: "string",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/payments/0/@ondc~1org~1settlement_basis",
                    },
                  },
                  "@ondc/org/settlement_window": {
                    type: "string",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/payments/0/@ondc~1org~1settlement_window",
                    },
                  },
                  "@ondc/org/withholding_amount": {
                    type: "string",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/payments/0/@ondc~1org~1withholding_amount",
                    },
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
                if: { properties: { type: { const: "ON-FULFILLMENT" } } },
                then: {
                  properties: {
                    collected_by: {
                      const: "BPP",
                    },
                  },
                },
                required: [
                  "id",
                  "params",
                  "status",
                  "type",
                  "collected_by",
                  "@ondc/org/buyer_app_finder_fee_type",
                  "@ondc/org/buyer_app_finder_fee_amount",
                  "@ondc/org/settlement_basis",
                  "@ondc/org/settlement_window",
                  "@ondc/org/withholding_amount",
                ],
              },
            },

            documents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                  },
                  label: {
                    type: "string",
                  },
                },
                required: ["url", "label"],
              },
            },
            created_at: {
              type: "string",
              format: "date-time",
              const: { $data: "/confirm/0/message/order/created_at" },
              errorMessage:
                "order/created_at should remain same as in /confirm - ${/confirm/0/message/order/created_at}",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
            tags: {
              type: "array",
              minItems: 3,
              items: {
                type: "object",
                properties: {
                  descriptor: {
                    properties: {
                      code: {
                        type: "string",
                        enum: constants.TERMS,
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
                              enum: constants.B2B_BPP_TERMS,
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
          additionalProperties: false,
          required: [
            "id",
            "state",
            "provider",
            "items",
            "billing",
            "fulfillments",
            "quote",
            "payments",
            "cancellation",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
