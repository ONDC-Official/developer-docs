module.exports = {
  $id: "http://example.com/schema/updateSchema",
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
          const: "update",
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
            }
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
        update_target: {
          type: "string",
        },
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              const: { $data: "/confirm/message/order/id" },
            },
            state: {
              type: "string",
              enum: ["Created", "Accepted", "In-progress"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    const: { $data: "/confirm/message/order/items/0/id" },
                  },
                  category_id: {
                    type: "string",
                    const: {
                      $data: "/confirm/message/order/items/0/category_id",
                    },
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        const: {
                          $data:
                            "/confirm/message/order/items/0/descriptor/code",
                        },
                      },
                    },
                    required: ["code"],
                  },
                },
                required: ["id", "category_id", "descriptor"],
              },
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    const: {
                      $data: "/init/0/message/order/items/0/fulfillment_id",
                    },
                  },
                  type: {
                    type: "string",
                  },
                  "@ondc/org/awb_no": {
                    type: "string",
                  },
                  tags: {
                    type: "object",
                    properties: {
                      "@ondc/org/order_ready_to_ship": {
                        type: "string",
                        enum: ["yes", "no"],
                      },
                    },
                    required: ["@ondc/org/order_ready_to_ship"],
                  },
                  start: {
                    type: "object",
                    properties: {
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
                      },
                    },
                    additionalProperties:false,
                    // required: ["instructions"],
                  },
                  end: {
                    type: "object",
                    properties: {
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
                        required: ["short_desc", "long_desc"],
                      },
                    },
                    additionalProperties:false,
                    // required: ["instructions"],
                  },
                  "@ondc/org/ewaybillno": {
                    type: "string",
                    const: { $data: "/confirm/0/message/order/fulfillments/0/@ondc~1org~1ewaybillno" },
                  },
                  "@ondc/org/ebnexpirydate": {
                    type: "string",
                    format: "date-time",
                    const: { $data: "/confirm/0/message/order/fulfillments/0/@ondc~1org~1ebnexpirydate"},
                  },
                },
                additionalProperties:false,
                required: ["id", "type", "tags"],

                // if: {
                //   properties: {
                //     tags: {
                //       properties: {
                //         "@ondc/org/order_ready_to_ship": { const: "yes" },
                //       },
                //     },
                //   },
                // },
                // then: {
                //   required: ["0/start/instructions"],
                //   errorMessage:
                //     "start/instructions are required when ready_to_ship = yes",
                // },

                // if: {
                //   properties: {
                //     tags: {
                //       properties: {
                //         "@ondc/org/order_ready_to_ship": { const: "yes" },
                //       },
                //     },
                //   },
                // },
                // then: {
                //   required: [
                //     "/on_update/message/order/fulfillments/0/start/time/range",
                //     "/on_update/message/order/fulfillments/0/end/time/range",
                //   ],
                //   errorMessage:
                //     "start and end time range is required when ready_to_ship=yes",
                // },

                // anyOf: [
                //   {
                //     properties: {
                //       start: {
                //         properties: {
                //           instructions: {
                //             required: ["short_desc"],
                //           },
                //         },
                //       },
                //       tags: {
                //         properties: {
                //           "@ondc/org/order_ready_to_ship": {
                //             enum: ["yes"],
                //           },
                //         },
                //       },
                //     },
                //     required: ["start"],
                //   },
                //   {
                //     properties: {
                //       tags: {
                //         properties: {
                //           "@ondc/org/order_ready_to_ship": {
                //             enum: ["no"],
                //           },
                //         },
                //       },
                //     },
                //   },
                // ],
              },
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
                          const: { $data: "/search/0/message/intent/@ondc~1org~1payload_details/weight/value" },
                          errorMessage:"Payload weight mismatches from /search"
                        },
                      },
                      required: ["unit", "value"],
                    },
                  },
                  required: ["id", "weight"],
                },
              },
              required: ["items", "order"],
            },
            updated_at: {
              type: "string",
              const: { $data: "3/context/timestamp" },
              errorMessage:
                "does not match context timestamp - ${3/context/timestamp}",
            },
          },
          required: ["id", "state", "items", "fulfillments", "updated_at"],
        },
      },
      required: ["update_target", "order"],
    },
    confirm: {
      type: "array",
      items: {
        $ref: "http://example.com/schema/confirmSchema#",
      },
    },
    on_confirm: {
      type: "array",
      items: {
        $ref: "http://example.com/schema/onConfirmSchema#",
      },
    },
    on_update: {
      type: "array",
      items: {
        $ref: "http://example.com/schema/onUpdateSchema#",
      },
    },
  },
  required: ["context", "message"],
};
