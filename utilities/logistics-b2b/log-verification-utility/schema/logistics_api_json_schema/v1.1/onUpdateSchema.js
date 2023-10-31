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
          const: { $data: "/search/0/context/city" },
        },
        action: {
          type: "string",
          const: "on_update",
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
              const: { $data: "/update/0/context/message_id" },
              errorMessage:
                "Message ID should be same as /update: ${/update/0/context/message_id}",
            },
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
              enum: ["Created", "Accepted", "Cancelled", "In-progress"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  category_id: {
                    type: "string",
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                      },
                    },
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
                      $data: "/confirm/0/message/order/fulfillments/0/id",
                    },
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
                      time: {
                        type: "object",
                        properties: {
                          range: {
                            type: "object",
                            properties: {
                              start: {
                                type: "string",
                                minimum: { $data: "7/context/timestamp" },
                                errorMessage: "${7/context/timestamp}",
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
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
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
                        },
                        required: ["range"],
                      },
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
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
                additionalProperties: false,
                required: ["id", "type", "start"],
              },
            },
            created_at: {
              type: "string",
              const: { $data: "/confirm/0/message/order/created_at" },
              errorMessage: "mismatches in /confirm and /on_update",
            },
            updated_at: {
              type: "string",
              allOf: [
                {
                  not: {
                    const: { $data: "/confirm/0/message/order/created_at" },
                  },
                  errorMessage:
                    "should be greater than order/created_at ${3/context/timestamp} in /confirm",
                },
                // {
                //   maximum: { $data: "3/context/timestamp" },
                //   errorMessage: "should not be future dated w.r.t context/timestamp ${3/context/timestamp}",
                // },
              ],
            },
          },
          additionalProperties: false,
          required: ["id", "state", "items", "fulfillments", "updated_at"],

          // oneOf: [
          //   {
          //     allOf: [
          //       {
          //         properties: {
          //           items: {
          //             type: "array",
          //             items: {
          //               type: "object",
          //               properties: {
          //                 descriptor: {
          //                   properties: {
          //                     code: { const: "P2H2P" },
          //                   },
          //                 },
          //               },
          //             },
          //           },
          //         },
          //       },
          //       {
          //         properties: {
          //           fulfillments: {
          //             required: [
          //               "@ondc/org/awb_no",
          //               "start/instructions/images",
          //             ],
          //           },
          //         },
          //       }
          //     ],
          //   },
          //   {
          //     properties: {
          //       items: {
          //         type: "array",
          //         items: {
          //           type: "object",
          //           properties: {
          //             descriptor: {
          //               properties: {
          //                 code: { const: "P2P" },
          //               },
          //             },
          //           },
          //         },
          //       },
          //     },
          //   },
          // ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
