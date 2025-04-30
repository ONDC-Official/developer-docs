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
              const: { $data: "/on_confirm/0/message/order/id" },
            },
            state: {
              type: "string",
              enum:["Cancelled"]
            },
            fulfillments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    $data: "/on_confirm/0/message/order/fulfillments/0/id",
                  },
                  type: {
                    type: "string",
                    $data: "/on_confirm/0/message/order/fulfillments/0/type",
                  },
                  state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            enum:["Cancelled"]
                          },
                        },
                        required: ["code"],
                      },
                    },
                    required: ["descriptor"],
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
                    required: ["cancellation_reason_id"],
                  },
                },
                additionalProperties: false,
                required: ["id", "type", "state", "tags"],
              },
            },
          },
          additionalProperties: false,
          required: ["id", "state", "fulfillments"],
        },
      },
      required: ["order"],
    },
  },
  confirm: {
    type: "array",
    items: {
      $ref: "confirmSchema#",
    },
  },
  search: {
    type: "array",
    items: {
      $ref: "searchSchema#",
    },
  },
  init: {
    type: "array",
    items: {
      $ref: "initSchema#",
    },
  },
  on_search: {
    type: "array",
    items: {
      $ref: "onSearchSchema#",
    },
  },
  required: ["context", "message"],
};
