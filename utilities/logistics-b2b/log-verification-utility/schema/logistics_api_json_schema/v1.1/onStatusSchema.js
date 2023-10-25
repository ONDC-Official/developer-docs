module.exports = {
  $id: "http://example.com/schema/onStatusSchema",
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
          const: "on_status",
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
            id: {
              type: "string",
              const: { $data: "/confirm/0/message/order/id" },
            },
            state: {
              type: "string",
              enum: [
                "Created",
                "Accepted",
                "In-progress",
                "Completed",
                "Cancelled",
              ],
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: { $data: "/init/0/message/order/provider/id" },
                  errorMessage: "mismatches between /init and /on_status",
                },
                locations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        const: {
                          $data:
                            "/init/0/message/order/provider/locations/0/id",
                        },
                      },
                    },
                  },
                },
              },
              required: ["id"],
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
                  category_id: {
                    type: "string",
                    const: {
                      $data: "/init/0/message/order/items/0/category_id",
                    },
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        const: {
                          $data:
                            "/init/0/message/order/items/0/descriptor/code",
                        },
                      },
                    },
                    required: ["code"],
                  },
                },
                required: ["id", "category_id", "descriptor"],
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
              },
              required: ["price", "breakup"],
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                  "@ondc/org/awb_no": {
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
                            enum: [
                              "Pending",
                              "Searching-for-Agent",
                              "Agent-assigned",
                              "Order-picked-up",
                              "Out-for-delivery",
                              "Order-delivered",
                              "RTO-Initiated",
                              "RTO-Delivered",
                              "RTO-Disposed",
                              "Cancelled",
                            ],
                          },
                        },
                        required: ["code"],
                      },
                    },
                    required: ["descriptor"],
                  },
                  tracking: {
                    type: "boolean",
                  },
                  start: {
                    type: "object",
                    properties: {
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
                            format: "date-time",
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
                      },
                    },
                    required: ["time"],
                  },
                  end: {
                    type: "object",
                    properties: {
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
                            format: "date-time",
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
                      },
                    },
                    required: ["time"],
                  },
                  agent: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                      phone: {
                        type: "string",
                      },
                    },
                    required: ["name", "phone"],
                  },
                  vehicle: {
                    type: "object",
                    properties: {
                      category: {
                        type: "string",
                      },
                      size: {
                        type: "string",
                      },
                      registration: {
                        type: "string",
                      },
                    },
                    required: ["category", "size", "registration"],
                  },
                  "@ondc/org/ewaybillno": {
                    type: "string",
                  },
                  "@ondc/org/ebnexpirydate": {
                    type: "string",
                  },
                },
                if: { properties: { type: { const: "Prepaid" } } },
                then: { required: ["type", "state", "tracking"] },
                else: {
                  required: ["type", "state"],
                },
              },
            },
            payment: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: { $data: "/on_init/0/message/order/payment/type" },
                },
                collected_by: {
                  type: "string",
                  const: {
                    $data: "/on_init/0/message/order/payment/collected_by",
                  },
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
                      upi_address: {
                        type: "string",
                      },
                      settlement_bank_account_no: {
                        type: "string",
                      },
                      settlement_ifsc_code: {
                        type: "string",
                      },
                      settlement_status: {
                        type: "string",
                      },
                      settlement_reference: {
                        type: "string",
                      },
                      settlement_timestamp: {
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
              required: ["type", "collected_by"],
            },
            billing: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  const: { $data: "/confirm/0/message/order/billing/name" },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
                address: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      not: { const: { $data: "1/locality" } },
                      const: {
                        $data: "/confirm/0/message/order/billing/address/name",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                    building: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/building",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                    locality: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/locality",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                    city: {
                      type: "string",
                      const: {
                        $data: "/confirm/0/message/order/billing/address/city",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                    state: {
                      type: "string",
                      const: {
                        $data: "/confirm/0/message/order/billing/address/state",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                    country: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/country",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                    area_code: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/area code",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_status",
                    },
                  },
                  additionalProperties: false,
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
                tax_number: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/tax_number",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
                phone: {
                  type: "string",
                  const: { $data: "/confirm/0/message/order/billing/phone" },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
                email: {
                  type: "string",
                  const: { $data: "/confirm/0/message/order/billing/email" },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
                created_at: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/created_at",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
                updated_at: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/updated_at",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
              },
              additionalProperties: false,
              required: ["name", "address", "phone", "tax_number"],
            },
            tags: {
              type: "object",
              properties: {
                cancellation_reason_id: {
                  type: "string",
                },
                "AWB no": {
                  type: "string",
                },
              },
            },
            created_at: {
              type: "string",
              const: { $data: "/confirm/0/message/order/created_at" },
              errorMessage: "mismatches in /confirm and /on_status",
            },
            updated_at: {
              type: "string",
            },
          },
          additionalProperties: false,
          if: { properties: { state: { const: "Cancelled" } } },
          then: {
            required: [
              "id",
              "state",
              "provider",
              "items",
              "quote",
              "fulfillments",
              "payment",
              "billing",
              "tags",
            ],
          },
          else: {
            required: [
              "id",
              "state",
              "provider",
              "items",
              "quote",
              "fulfillments",
              "payment",
              "billing",
            ],
          },
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
