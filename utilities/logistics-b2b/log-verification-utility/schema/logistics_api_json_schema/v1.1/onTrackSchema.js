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
          const:"1.1.0"
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
            }
          ],
        },
        timestamp: {
          type: "string",
          format:"date-time"
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
            url: {
              type: "string",
            },
            status: {
              type: "string",
              enum:["active","inactive"]
            },
          },
          required: ["url", "status"],
        },
      },
      required: ["tracking"],
    },
  },
  search: {
    type: "array",
    items: {
      $ref: "searchSchema#",
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
