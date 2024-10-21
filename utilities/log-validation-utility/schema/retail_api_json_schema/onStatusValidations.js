invoiceRules = [
  {
    if: {
      properties: {
        fulfillments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              state: {
                type: "object",
                properties: {
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        enum: [
                          "Order-picked-up",
                          "Out-for-delivery",
                          "Order-delivered",
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    then: {
      properties: {
        documents: {
          type: "array",
          items: {
            type: "object",
            properties: {
              url: { type: "string" },
              label: { type: "string", const: "Invoice" },
            },
            required: ["url", "label"],
          },
        },
      },
      required: ["documents"],
    },
  },
  {
    if: {
      properties: {
        fulfillments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              state: {
                type: "object",
                properties: {
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        enum: ["Pending", "Packed"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    then: {
      not: {
        required: ["documents"],
      },
      errorMessage: `Invoice url must be present as part of documents objects (only in Order-picked-up state and thereafter)`,
    },
  },
];

timeRules = [
  {
    if: {
      properties: {
        state: {
          type: "object",
          properties: {
            descriptor: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "Order-picked-up",
                    "Out-for-delivery",
                    "Order-delivered",
                  ],
                },
              },
            },
          },
        },
      },
    },
    then: {
      properties: {
        start: {
          type: "object",
          properties: {
            time: {
              type: "object",
              properties: {
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
              },
              required: ["timestamp"],
              errorMessage: `pickup time is mandatory when order is picked and thereafter`,
            },
          },
        },
      },
    },
    else: {
      properties: {
        start: {
          type: "object",
          properties: {
            time: {
              type: "object",
              not: {
                properties: {
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
                required: ["timestamp"],
              },
              errorMessage: `pickup time should not be present until order is picked`,
            },
          },
        },
      },
    },
  },
  {
    if: {
      properties: {
        state: {
          type: "object",
          properties: {
            descriptor: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: ["Order-delivered"],
                },
              },
            },
          },
        },
      },
    },
    then: {
      properties: {
        end: {
          type: "object",
          properties: {
            time: {
              type: "object",
              properties: {
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
              },
              required: ["timestamp"],
              errorMessage: `delivery time is mandatory when order is delivered`,
            },
          },
        },
      },
    },
    else: {
      properties: {
        end: {
          type: "object",
          properties: {
            time: {
              type: "object",
              not: {
                properties: {
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
                required: ["timestamp"],
              },
              errorMessage: `delivery time should not be present until order is delivered`,
            },
          },
        },
      },
    },
  },
];

module.exports = { invoiceRules, timeRules };
