const constants = require("../../../utils/constants");
const {
  ORDER_STATE,
  CANCELLATION_CODE,
  TITLE_TYPE,
  FULFILLMENT_STATE,
} = require("../../../utils/constants");
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
              enum: ORDER_STATE,
            },
            cancellation: {
              cancelled_by: { type: "string" },
              reason: {
                type: "object",
                properties: {
                  reason: { type: "string", enum: CANCELLATION_CODE },
                },
              },
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: {
                    $data: "/init/0/message/order/provider/id",
                  },
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
                        errorMessage: "mismatches between /init and /on_status",
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
                  },
                  fulfillment_id: {
                    type: "string",
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
                required: ["id", "category_id", "descriptor", "fulfillment_id"],
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
                      "@ondc/org/item_id": {
                        type: "string",
                      },
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
              required: ["price", "breakup"],
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: {
                    type: "string",
                    enum: constants.FULFILLMENT_TYPE,
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
                            enum: FULFILLMENT_STATE,
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
                                format: "date-time",
                              },
                              end: {
                                type: "string",
                                format: "date-time",
                              },
                            },
                            required: ["start", "end"],
                          },
                          timestamp: {
                            type: "string",
                            format: "date-time",
                          },
                        },
                      },
                      instructions: {
                        code: { type: "string" },
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
                      person: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                        },
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                            pattern:
                              "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
                            errorMessage: "Incorrect gps value",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                minLength: 3,
                                not: { const: { $data: "1/locality" } },
                                errorMessage: "cannot be equal to locality",
                              },
                              building: {
                                type: "string",
                                minLength: 3,
                                not: { const: { $data: "1/locality" } },
                                errorMessage: "cannot be equal to locality",
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
                            isLengthValid: true,
                            errorMessage:
                              "name + building + locality < 190 chars",
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
                                format: "date-time",
                              },
                              end: {
                                type: "string",
                                format: "date-time",
                              },
                            },
                            required: ["start", "end"],
                          },
                          timestamp: {
                            type: "string",
                            format: "date-time",
                          },
                        },
                      },
                      instructions: {
                        code: { type: "string" },
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
                      person: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                        },
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                            pattern:
                              "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
                            errorMessage: "Incorrect gps value",
                          },
                          address: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                minLength: 3,
                                not: { const: { $data: "1/locality" } },
                                errorMessage: "cannot be equal to locality",
                              },
                              building: {
                                type: "string",
                                minLength: 3,
                                not: { const: { $data: "1/locality" } },
                                errorMessage: "cannot be equal to locality",
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
                            isLengthValid: true,
                            errorMessage:
                              "name + building + locality < 190 chars",
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
                  vehicle: {
                    type: "object",
                    properties: {
                      registration: {
                        type: "string",
                      },
                    },
                    required: ["registration"],
                  },
                  "@ondc/org/ewaybillno": {
                    type: "string",
                  },
                  "@ondc/org/ebnexpirydate": {
                    type: "string",
                  },
                },

                if: { properties: { type: { const: "Delivery" } } },
                then: {
                  properties: {
                    start: {
                      properties: {
                        time: { required: ["range"] },
                      },
                      required: ["time", "person", "location", "contact"],
                    },

                    end: {
                      properties: {
                        time: { required: ["range"] },
                      },
                      required: ["time", "person", "location", "contact"],
                    },
                  },
                  required: ["id", "type", "state", "tracking", "start", "end"],
                },
                else: {
                  properties: {
                    start: {
                      properties: {
                        time: { required: ["timestamp"] },
                      },
                      required: ["time"],
                    },
                  },
                  required: ["id", "type", "state", "start"],
                },
              },
            },
            payment: {
              type: "object",
              properties: {
                "@ondc/org/collection_amount": {
                  type: "string",
                  const: {
                    $data:
                      "/on_confirm/0/message/order/payment/@ondc~1org~1collection_amount",
                  },
                },
                type: {
                  type: "string",
                  const: {
                    $data: "/on_confirm/0/message/order/payment/type",
                  },
                },
                collected_by: {
                  type: "string",
                  const: {
                    $data: "/on_confirm/0/message/order/payment/collected_by",
                  },
                },
                time: {
                  type: "object",
                  properties: {
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
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
                  const: {
                    $data: "/confirm/0/message/order/billing/name",
                  },
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
                  const: {
                    $data: "/confirm/0/message/order/billing/phone",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
                email: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/email",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_status",
                },
              },

              required: ["name", "address", "phone", "email", "tax_number"],
            },
            "@ondc/org/linked_order": {
              allOf: [
                {
                  $ref: "confirmSchema#/properties/message/properties/order/properties/@ondc~1org~1linked_order",
                },
                {
                  $data: "/confirm/0/message/order/@ondc~1org~1linked_order",
                },
              ],
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
              "cancellation",
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
