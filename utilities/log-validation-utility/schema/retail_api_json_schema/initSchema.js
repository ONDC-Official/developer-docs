module.exports = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "nic2004:52110",
        },
        action: {
          type: "string",
          const: "init",
        },
        country: {
          type: "string",
        },
        city: {
          type: "string",
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
        },
        message_id: {
          type: "string",
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string",
          format: "duration",
        },
      },
      required: [
        "domain",
        "action",
        "country",
        "city",
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
              required: ["id", "locations"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    minLength: 1,
                  },
                  fulfillment_id: {
                    type: "string",
                    minLength: 1,
                  },
                  quantity: {
                    type: "object",
                    properties: {
                      count: {
                        type: "integer",
                      },
                    },
                    required: ["count"],
                  },
                },
                required: ["id", "fulfillment_id", "quantity"],
              },
            },
            billing: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                address: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    building: {
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
                tax_number: {
                  type: "string",
                },
                email: {
                  type: "string",
                  format: "email",
                },
                phone: { type: "string", minLength: 10, maxLength: 11 },

                created_at: {
                  type: "string",
                  format: "date-time",
                },
                updated_at: {
                  type: "string",
                  format: "date-time",
                },
              },
              required: [
                "name",
                "address",
                "phone",
                "created_at",
                "updated_at",
              ],
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
                    const: "Delivery",
                  },
                  end: {
                    type: "object",
                    properties: {
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
                            minLength: 10,
                            maxLength: 11,
                          },
                        },
                        required: ["phone"],
                      },
                    },
                    required: ["location", "contact"],
                  },
                },
                required: ["id", "type", "end"],
              },
            },
          },
          required: ["provider", "items", "billing", "fulfillments"],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
