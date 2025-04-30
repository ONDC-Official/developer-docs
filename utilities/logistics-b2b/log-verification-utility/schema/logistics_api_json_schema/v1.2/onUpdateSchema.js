const constants = require("../../../utils/constants");
const {
  ORDER_STATE,
  TITLE_TYPE,
  FULFILLMENT_STATE,
} = require("../../../utils/constants");
module.exports = {
  $id: "http://example.com/schema/onUpdateSchema",
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
          const: {
            $data: "/confirm/0/context/city",
          },
        },
        action: {
          type: "string",
          const: "on_update",
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
          const: {
            $data: "/search/0/context/transaction_id",
          },
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
              const: {
                $data: "/confirm/0/message/order/id",
              },
            },
            state: {
              type: "string",
              enum: ORDER_STATE,
            },
            provider: {
              type: "object",
              properties: {
                id: { type: "string" },
                locations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
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
                  fulfillment_id: {
                    type: "string",
                    const: {
                      $data: "/init/0/message/order/items/0/fulfillment_id",
                    },
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
                  },
                  time: {
                    type: "object",
                    properties: {
                      label: {
                        type: "string",
                      },
                      duration: {
                        type: "string",
                        const: {
                          $data:
                            "/on_confirm/0/message/order/items/0/time/duration",
                        },
                      },
                      timestamp: {
                        type: "string",
                        const: {
                          $data:
                          "/on_confirm/0/message/order/items/0/time/timestamp",
                        },
                      },
                    },
                    required: ["label", "duration", "timestamp"],
                  },
                },
                required: ["id", "fulfillment_id", "category_id", "descriptor"],
              },
            },
            quote: {
              type: "object",
              properties: {
                price: {
                  $ref: "commonSchema#/properties/priceFormat",
                },
                breakup: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      "@ondc/org/item_id": { type: "string" },
                      "@ondc/org/title_type": {
                        type: "string",
                        enum: TITLE_TYPE,
                      },
                      price: {
                        $ref: "commonSchema#/properties/priceFormat",
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
                  state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: { type: "string", enum: FULFILLMENT_STATE },
                        },
                      },
                    },
                  },
                  "@ondc/org/awb_no": {
                    type: "string",
                  },
                  tracking: {
                    type: "boolean",
                  },
                  start: {
                    $merge: {
                      with: {
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
                                    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                    errorMessage:"should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format"
                                  },
                                  end: {
                                    type: "string",
                                    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                    errorMessage:"should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format"
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
                              code: {
                                type: "string",
                                enum: constants.PCC_CODE,
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

                            required: [],
                          },
                        },
                      },
                      source: {
                        $ref: "commonSchema#/properties/addressFormat",
                      },
                    },
                    required: ["time"],
                  },
                  end: {
                    type: "object",
                    allOf: [
                      {
                        properties: {
                          time: {
                            type: "object",
                            properties: {
                              range: {
                                type: "object",
                                properties: {
                                  start: {
                                    type: "string",
                                    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                    errorMessage:"should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format"
                                  },
                                  end: {
                                    type: "string",
                                    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                    errorMessage:"should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format"
                                  },
                                },  
                                required: ["start", "end"],
                              },
                              timestamp: {
                                type: "string",
                                pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                                errorMessage:"should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format"
                              },
                            },
                            required: ["range"],
                          },
                          instructions: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: constants.DCC_CODE,
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
                          },
                        },
                      },
                      {
                        $ref: "commonSchema#/properties/addressFormat",
                      },
                    ],
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
                  },
                  "@ondc/org/ewaybillno": {
                    type: "string",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/fulfillments/0/@ondc~1org~1ewaybillno",
                    },
                  },
                  "@ondc/org/ebnexpirydate": {
                    type: "string",
                    format: "date-time",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/fulfillments/0/@ondc~1org~1ebnexpirydate",
                    },
                  },
                },
                required: ["id", "type", "start", "state", "tracking"],
              },
            },
            billing: {
              allOf: [
                {
                  $ref: "confirmSchema#/properties/message/properties/order/properties/billing",
                },
                {
                  $data: "/confirm/0/message/order/billing",
                },
              ],
            },
            payment: {
              allOf: [
                {
                  $ref: "onConfirmSchema#/properties/message/properties/order/properties/payment",
                },
                {
                  $data: "/on_confirm/0/message/order/payment",
                },
              ],
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
                        enum: constants.CATEGORIES,
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
                                enum: constants.UNITS_WEIGHT,
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
                      const: {
                        $data:
                          "/update/0/message/order/@ondc~1org~1linked_order/order/id",
                      },
                    },
                    weight: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: constants.UNITS_WEIGHT,
                        },
                        value: {
                          type: "number",
                          const: {
                            $data:
                              "/update/0/message/order/@ondc~1org~1linked_order/order/weight/value",
                          },
                          errorMessage:
                            "Payload weight mismatches from /update",
                        },
                      },
                      required: ["unit", "value"],
                    },
                    dimensions: {
                      type: "object",
                      properties: {
                        length: {
                          type: "object",
                          properties: {
                            unit: {
                              type: "string",
                              enum: constants.UNITS_DIMENSIONS,
                            },
                            value: {
                              type: "number",
                            },
                          },
                          required: ["unit", "value"],
                        },
                        breadth: {
                          type: "object",
                          properties: {
                            unit: {
                              type: "string",
                              enum: constants.UNITS_DIMENSIONS,
                            },
                            value: {
                              type: "number",
                            },
                          },
                          required: ["unit", "value"],
                        },
                        height: {
                          type: "object",
                          properties: {
                            unit: {
                              type: "string",
                              enum: constants.UNITS_DIMENSIONS,
                            },
                            value: {
                              type: "number",
                            },
                          },
                          required: ["unit", "value"],
                        },
                      },
                      required: ["length", "breadth", "height"],
                    },
                  },
                  required: ["id", "weight"],
                },
              },
              required: ["items", "provider", "order"],
            },
            created_at: {
              type: "string",
              const: {
                $data: "/confirm/0/message/order/created_at",
              },
              errorMessage: "mismatches in /confirm and /on_update",
            },
            updated_at: {
              type: "string",
              format:"date-time"
            },
          },
          additionalProperties: false,
          required: [
            "id",
            "state",
            "items",
            "fulfillments",
            "updated_at",
            "@ondc/org/linked_order",
            "payment",
            "billing",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
