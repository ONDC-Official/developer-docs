const constants = require("../../../utils/constants");
module.exports = {
  $id: "http://example.com/schema/onTrackSchema",
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
          const: "on_track",
        },
        core_version: {
          type: "string",
          const:"1.2.0"
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
              const: { $data: "/track/0/context/message_id" },
              errorMessage:
                "Message ID should be same as /track: ${/track/0/context/message_id}",
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
        tracking: {
          type: "object",
          properties: {
            id: {
              type: "string",
              const: {
                $data: "/init/0/message/order/items/0/fulfillment_id",
              },
            },
            url: {
              type: "string",
            },
            location: {
              type: "object",
              properties: {
                gps: {
                  type: "string",
                },
                time: {
                  type: "object",
                  properties: {
                    timestamp: {
                      type: "string",
                    },
                  },
                  required: ["timestamp"],
                },
                updated_at: {
                  type: "string",
                },
              },
              required: ["gps", "time", "updated_at"],
            },
            status: {
              type: "string",
              enum: constants.TRACKING_STATUS,
            },
            tags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    enum: ["path"],
                  },
                  list: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                          enum: ["lat_lng", "sequence"],
                        },
                        value: {
                          type: "string",
                        },
                      },
                      required: ["code", "value"],
                    },
                  },
                },
                required: ["code", "list"],
              },
            },
          },
          required: ["id", "location", "status"],
        },
      },
      required: ["tracking"],
    },
  },
  required: ["context", "message"],
};
