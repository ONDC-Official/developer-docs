module.exports = {
  $id: "http://example.com/schema/confirmSchema",
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
          const: { $data: "/on_search/0/context/city" },
        },
        action: {
          type: "string",
          const: "confirm",
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
        ttl: {
          type: "string",
          const: "PT30S",
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
              const: "Created",
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
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              required: ["id"],
              oneOf: [
                {
                  required: [
                    "/on_search/0/message/catalog/bpp~1providers/0/locations",
                    "locations",
                  ],
                },
                {
                  not: {
                    required: [
                      "/on_search/0/message/catalog/bpp~1providers/0/locations",
                    ],
                  },
                },
              ],
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
                anyOf: [
                  {
                    allOf: [
                      {
                        properties: {
                          id: {
                            const: {
                              $data:
                                "/on_search/0/message/catalog/bpp~1providers/0/items/0/id",
                            },
                          },
                        },
                      },
                      {
                        properties: {
                          category_id: {
                            const: {
                              $data:
                                "/on_search/0/message/catalog/bpp~1providers/0/items/0/category_id",
                            },
                          },
                        },
                      },
                    ],
                  },
                  {
                    allOf: [
                      {
                        properties: {
                          id: {
                            const: {
                              $data:
                                "/on_search/0/message/catalog/bpp~1providers/1/items/0/id",
                            },
                          },
                        },
                      },
                      {
                        properties: {
                          category_id: {
                            const: {
                              $data:
                                "/on_search/0/message/catalog/bpp~1providers/1/items/0/category_id",
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
            quote: {
              type: "object",
              const: { $data: "/on_init/0/message/order/quote" },
              errorMessage: "object mismatches in /on_init and /confirm.",
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
                      errorMessage: "mismatches in /on_init and /confirm.",
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
                        enum: ["Delivery Charge", "Tax"],
                      },
                      price: {
                        type: "object",
                        properties: {
                          currency: {
                            type: "string",
                            const: "INR",
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
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                  },
                  "@ondc/org/awb_no": {
                    type: "string",
                  },
                  start: {
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
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                minLength: 3,
                                not: { const: { $data: "1/locality" } },
                              },
                              building: {
                                type: "string",
                                minLength: 3,
                              },
                              locality: {
                                type: "string",
                                minLength: 3,
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
                          },
                        },
                        required: ["phone"],
                      },
                      instructions: {
                        type: "object",
                        properties: {
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
                        //required: ["long_desc", "images"],
                      },
                    },
                    required: ["person", "location", "contact"],
                  },
                  end: {
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
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                minLength: 3,
                                not: { const: { $data: "1/locality" } },
                                errorMessage:
                                  "name + building + locality < 190 chars & each of name / building / locality > 3 chars; name != locality",
                              },
                              building: {
                                type: "string",
                                minLength: 3,
                              },
                              locality: {
                                type: "string",
                                minLength: 3,
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
                          },
                        },
                        required: ["phone"],
                      },
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
                          },
                          additional_desc: {
                            type: "object",
                            properties: {
                              content_type: {
                                type: "string",
                              },
                              url: {
                                type: "string",
                              },
                            },
                            required: ["content_type", "url"],
                          },
                        },
                        // required: [
                        //   "long_desc",
                        //   "additional_desc",
                        // ],
                      },
                    },
                    required: ["person", "location", "contact"],
                  },

                  "@ondc/org/ewaybillno": {
                    type: "string",
                  },
                  "@ondc/org/ebnexpirydate": {
                    type: "string",
                    format: "date-time",
                  },
                  tags: {
                    type: "object",
                    properties: {
                      "@ondc/org/order_ready_to_ship": {
                        type: "string",
                        enum: ["yes", "no"],
                      },
                    },
                    // if: {
                    //   properties: {
                    //     "@ondc/org/order_ready_to_ship": { const: "yes" },
                    //   },
                    // },
                    // then: {
                    //   required: ["1/start/instructions"],
                    //   errorMessage:
                    //     "Pickup code (fulfillments/start/instructions), mandatory if order_ready_to_ship = yes in /confirm",
                    // },

                    required: ["@ondc/org/order_ready_to_ship"],
                  },
                },
                required: ["id", "type", "start", "end", "tags"],
              },
            },
            billing: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/name" },
                  errorMessage: "mismatches in /billing in /init and /confirm",
                },
                address: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      not: { const: { $data: "1/locality" } },
                      const: {
                        $data: "/init/0/message/order/billing/address/name",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
                    },
                    building: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/address/building",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
                    },
                    locality: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/address/locality",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
                    },
                    city: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/address/city",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
                    },
                    state: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/address/state",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
                    },
                    country: {
                      type: "string",
                      const: {
                        $data: "/init/0/message/order/billing/address/country",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
                    },
                    area_code: {
                      type: "string",
                      const: {
                        $data:
                          "/init/0/message/order/billing/address/area code",
                      },
                      errorMessage:
                        "mismatches in /billing in /init and /confirm",
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
                    $data: "/init/0/message/order/billing/tax_number",
                  },
                  errorMessage: "mismatches in /billing in /init and /confirm",
                },
                phone: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/phone" },
                  errorMessage: "mismatches in /billing in /init and /confirm",
                },
                email: {
                  type: "string",
                  const: { $data: "/init/0/message/order/billing/email" },
                  errorMessage: "mismatches in /billing in /init and /confirm",
                },
                created_at: {
                  type: "string",
                  const: {
                    $data: "/init/0/message/order/billing/created_at",
                  },
                  errorMessage: "mismatches in /billing in /init and /confirm",
                },
                updated_at: {
                  type: "string",
                  const: {
                    $data: "/init/0/message/order/billing/updated_at",
                  },
                  errorMessage: "mismatches in /billing in /init and /confirm",
                },
              },
              additionalProperties: false,
              required: [
                "name",
                "address",
                "phone",
                "tax_number",
                "created_at",
                "updated_at",
              ],
            },
            payment: {
              type: "object",
              properties: {
                "@ondc/org/collection_amount": {
                  type: "string",
                },
                collected_by: {
                  type: "string",
                  const: {
                    $data: "/on_init/0/message/order/payment/collected_by",
                  },
                  errorMessage:
                    "mismatches in /payment in /on_init and /confirm",
                },
                type: {
                  type: "string",
                  enum: ["ON-FULFILLMENT", "POST-FULFILLMENT", "ON-ORDER"],
                  const: {
                    $data: "/on_init/0/message/order/payment/type",
                  },
                  errorMessage:
                    "mismatches in /payment in /on_init and /confirm",
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
                            "bank_name",
                            "branch_name",
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
              required: ["collected_by", "type"],
            },
            "@ondc/org/linked_order": {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category_id: {
                        type: "string",
                        enum: [
                          "Grocery",
                          "F&B",
                          "Fashion",
                          "BPC",
                          "Electronics",
                          "Home & Decor",
                          "Pharma",
                          "Agriculture",
                          "Mobility",
                        ],
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
                      quantity: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                          measure: {
                            type: "object",
                            properties: {
                              unit: {
                                type: "string",
                              },
                              value: {
                                type: "number",
                              },
                            },
                            required: ["unit", "value"],
                          },
                        },
                        required: ["count", "measure"],
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
                      "category_id",
                      "descriptor",
                      "quantity",
                      "price",
                    ],
                  },
                },
                provider: {
                  type: "object",
                  properties: {
                    descriptor: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                      },
                      required: ["name"],
                    },
                    address: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        street: {
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
                        area_code: {
                          type: "string",
                        },
                      },

                      required: [
                        "name",
                        "locality",
                        "city",
                        "state",
                        "area_code",
                      ],
                    },
                  },
                  required: ["descriptor", "address"],
                },
                order: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    weight: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                        },
                        value: {
                          type: "number",
                          const: {
                            $data:
                              "/search/0/message/intent/@ondc~1org~1payload_details/weight/value",
                          },
                          errorMessage:
                            "Payload weight mismatches from /search",
                        },
                      },
                      required: ["unit", "value"],
                    },
                  },
                  required: ["id", "weight"],
                },
              },
              required: ["items", "provider", "order"],
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
          additionalProperties: false,
          required: [
            "id",
            "state",
            "provider",
            "items",
            "quote",
            "fulfillments",
            "billing",
            "payment",
            "@ondc/org/linked_order",
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
