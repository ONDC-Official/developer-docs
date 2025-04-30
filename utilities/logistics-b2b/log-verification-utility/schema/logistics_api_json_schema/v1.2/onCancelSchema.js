const constants = require("../../../utils/constants");
const { TITLE_TYPE, CANCELLATION_CODE } = require("../../../utils/constants");
module.exports = {
  $id: "http://example.com/schema/onCancelSchema",
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
        },
        action: {
          type: "string",
          const: "on_cancel",
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
            {
              const: { $data: "/cancel/0/context/message_id" },
              errorMessage:
                "Message ID should be same as /cancel: ${/cancel/0/context/message_id}",
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
                $data: "/on_confirm/0/message/order/id",
              },
            },
            state: {
              type: "string",
              enum: ["Cancelled"],
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
              required: ["id"],
            },
            cancellation: {
              type: "object",
              properties: {
                reason: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      const: { $data: "/cancel/0/message/cancellation_reason_id" },
                      errorMessage:`does not match the cancellation reason id in /cancel`
                    },
                  },
                  required: ["id"],
                },
                cancelled_by: {
                  type: "string",
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      cancelled_by: { const: { $data: "4/context/bpp_id" } },
                    },
                  },
                  then: {
                    properties: {
                      reason: {
                        properties: {
                          id: { enum: constants.LSP_CANCELLATION_CODES },
                        },
                      },
                    },
                  },
                },
              ],
              required: ["reason", "cancelled_by"],
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
                  time: {
                    type: "object",
                    properties: {
                      label: {
                        type: "string",
                      },
                      duration: {
                        type: "string",
                      },
                      timestamp: {
                        type: "string",
                      },
                    },
                    required: ["label", "duration", "timestamp"],
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
                  minItems:1,
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
              isQuoteMatching: true,
            },

            fulfillments: {
              type: "array",
              minItems:1,
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                    enum: constants.FULFILLMENT_TYPE,
                  },
                  state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            enum: ["Cancelled", "RTO-Initiated"],
                          },
                        },
                        required: ["code"],
                      },
                    },
                    required: ["descriptor"],
                  },
                  "@ondc/org/awb_no": {
                    type: "string",
                    const: {
                      $data:
                        "/on_confirm/0/message/order/fulfillments/0/@ondc~1org~1awb_no",
                    },
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
                            required: ["start"],
                          },
                          timestamp: {
                            type: "string",
                            pattern:
                              "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                            errorMessage:
                              "should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format",
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
                            required: ["start"],
                          },
                          timestamp: {
                            type: "string",
                            pattern:
                              "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$",
                            errorMessage:
                              "should be in RFC 3339 (YYYY-MM-DDTHH:MN:SS.MSSZ) Format",
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
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                          enum: constants.CANCELLATION_TAGS_CODES,
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: constants.CANCELLATION_TAGS_LIST,
                              },
                              value: {
                                type: "string",
                              },
                            },
                            required: ["code", "value"],
                          },
                        },
                      },
                    },
                  },
                },
                additionalProperties: false,

                if: { properties: { type: { const: "Delivery" } } },
                then: {
                  properties: {
                    start: {
                      properties: {
                        time: { required: ["range"] },
                      },
                      required: ["person", "location", "contact"],
                    },

                    end: {
                      properties: {
                        time: { required: ["range"] },
                      },
                      required: ["person", "location", "contact"],
                    },
                  },
                  required: ["id", "type", "state", "start", "end", "tracking"],
                },
                else: {
                  properties: {
                    start: {
                      properties: {
                        time: { required: ["timestamp"] },
                      },
                      required: ["time","location"],
                    },
                    end: {
                      required: ["location"],
                    },
                  },
                  required: ["id", "type", "state", "start","end"],
                },
              },
            },
            billing: {
              allOf: [
                {
                  $ref: "onConfirmSchema#/properties/message/properties/order/properties/billing",
                },
                {
                  $data: "/on_confirm/0/message/order/billing",
                },
              ],
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
                params: {
                  type: "object",
                  properties: {
                    amount: {
                      type: "string",
                    },
                    currency: {
                      type: "string",
                    },
                  },
                  required: ["amount", "currency"],
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
            "@ondc/org/linked_order": {
              allOf: [
                {
                  $ref: "onConfirmSchema#/properties/message/properties/order/properties/@ondc~1org~1linked_order",
                },
                {
                  $data: "/on_confirm/0/message/order/@ondc~1org~1linked_order",
                },
              ],
            },
            created_at: {
              type: "string",
              const: {
                $data: "/confirm/0/message/order/created_at",
              },
              errorMessage: "mismatches in /confirm and /on_cancel",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
          additionalProperties: false,

          // if: {
          //   properties: {
          //     cancellation: {
          //       properties: {
          //         reason: {
          //           properties: {
          //             id: {
          //               enum: ["011", "012", "013", "014", "015"],
          //             },
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
          // then: {
          //   properties: {
          //     fulfillments: {
          //       required: ["tags"],
          //       errorMessage: "tags required when RTO is triggered",
          //     },
          //   },
          // },

          required: [
            "id",
            "state",
            "provider",
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
  // isFutureDated: true,

  required: ["context", "message"],
};
