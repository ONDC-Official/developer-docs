module.exports = {
  $id: "http://example.com/schema/onSearchSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
        },
        location: {
          type: "object",
          properties: {
            city: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  const: { $data: "/search/0/context/location/city/code" },
                },
              },
              required: ["code"],
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  const: { $data: "/search/0/context/location/country/code" },
                },
              },
              required: ["code"],
            },
          },
          required: ["city", "country"],
        },
        action: {
          type: "string",
          const: "on_search",
        },
        version: {
          type: "string",
          const: "2.0.1",
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
              const: { $data: "/search/0/context/message_id" },
              errorMessage:
                "Message ID for on_action API should be same as action API: ${/search/0/context/message_id}",
            },
            {
              not: {
                const: { $data: "1/transaction_id" },
              },
              errorMessage:
                "Message ID should not be equal to transaction_id: ${1/transaction_id}",
            },
          ]
        },
        timestamp: {
          type: "string",
          format: "date-time",
        },
        ttl: {
          type: "string"       
        },
      },
      required: [
        "domain",
        "location",
        "action",
        "version",
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
        catalog: {
          type: "object",
          properties: {
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
                    enum: ["Delivery", "Self-Pickup"]
                  },
                },
                required: ["id", "type"],
              },
            },
            payments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                    enum: [
                      "PRE-FULFILLMENT",
                      "ON-FULFILLMENT",
                      "POST-FULFILLMENT",
                    ],
                  },
                },
                required: ["id", "type"],
              },
            },
            descriptor: {
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
                    type: "object",
                    properties: {
                      url: {
                        type: "string",
                      },
                    },
                    required: ["url"],
                  },
                },
              },
              required: ["name", "short_desc", "long_desc", "images"],
            },
            providers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                      },
                      code: {
                        type: "string",
                      },
                      short_desc: {
                        type: "string",
                      },
                      long_desc: {
                        type: "string",
                      },
                      additional_desc: {
                        type: "object",
                        properties: {
                          url: {
                            type: "string",
                          },
                          content_type: {
                            type: "string",
                          },
                        },
                        required: ["url", "content_type"],
                      },
                      images: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            url: {
                              type: "string",
                            },
                          },
                          required: ["url"],
                        },
                      },
                    },
                    required: ["name", "code"],
                  },
                  rating: {
                    type: "string",
                  },
                  ttl: {
                    type: "string",
                    format: "duration"
                  },
                  locations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        gps: {
                          type: "string",
                          pattern:
                            "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
                          errorMessage: "Incorrect gps value",
                        },
                        address: {
                          type: "string",
                        },
                        city: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              pattern: "^(std:?[0-9]{2,3})$"
                            },
                            name: {
                              type: "string",
                            },
                          },
                          required: ["code", "name"],
                        },
                        state: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                              pattern: "^(std:?[0-9]{2,3})$"
                            },
                          },
                          required: ["code"],
                        },
                        country: {
                          type: "object",
                          properties: {
                            code: {
                              type: "string",
                            },
                          },
                          required: ["code"],
                        },
                        area_code: {
                          type: "string",
                        },
                      },
                      additionalProperties:false,
                      required: [
                        "id",
                        "gps",
                        "address",
                        "city",
                        "state",
                        "country",
                        "area_code",
                      ],
                    },
                  },
                  creds: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        type: {
                          type: "string",
                          enum: ["License", "Badge", "Permit", "Certificate"],
                        },
                        desc: {
                          type: "string",
                        },
                        url: {
                          type: "string",
                          format: "uri",
                        },
                      },
                      required: ["id", "type", "desc", "url"],
                    },
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        descriptor: {
                          properties: {
                            code: {
                              type: "string",
                            },
                          },
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              descriptor: {
                                properties: {
                                  code: {
                                    type: "string",
                                  },
                                },
                              },
                              value: {
                                type: "string",
                              },
                            },
                            required: ["descriptor", "value"],
                          },
                        },
                      },
                      required: ["descriptor", "list"],
                    },
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        parent_item_id: {
                          type: "string",
                        },
                        descriptor: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                            code: {
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
                                type: "object",
                                properties: {
                                  url: {
                                    type: "string",
                                  },
                                },
                                required: ["url"],
                              },
                            },
                            media: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  mimetype: {
                                    type: "string",
                                  },
                                  url: {
                                    type: "string",
                                  },
                                },
                                required: ["mimetype", "url"],
                              },
                            },
                          },
                          required: [
                            "name",
                            "code",
                            "short_desc",
                            "long_desc",
                            "images",
                          ],
                        },
                        creator: {
                          type: "object",
                          properties: {
                            descriptor: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                },
                                contact: {
                                  type: "object",
                                  properties: {
                                    name: {
                                      type: "string",
                                    },
                                    address: {
                                      type: "object",
                                      properties: {
                                        full: {
                                          type: "string",
                                        },
                                      },
                                      required: ["full"],
                                    },
                                    phone: {
                                      type: "string",
                                    },
                                    email: {
                                      type: "string",
                                    },
                                  },
                                  required: ["address", "phone"],
                                },
                              },
                              required: ["name", "contact"],
                            },
                          },
                          required: ["descriptor"],
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
                            offered_value: {
                              type: "string",
                            },
                            maximum_value: {
                              type: "string",
                            },
                          },
                          required: ["currency", "value", "maximum_value"],
                        },
                        quantity: {
                          type: "object",
                          properties: {
                            unitized: {
                              type: "object",
                              properties: {
                                measure: {
                                  type: "object",
                                  properties: {
                                    unit: {
                                      type: "string",
                                      enum: [
                                        "unit",
                                        "dozen",
                                        "gram",
                                        "kilogram",
                                        "tonne",
                                        "litre",
                                        "millilitre",
                                      ],
                                    },
                                    value: {
                                      type: "string",
                                    },
                                  },
                                  required: ["unit", "value"],
                                },
                              },
                              required: ["measure"],
                            },
                            available: {
                              type: "object",
                              properties: {
                                measure: {
                                  type: "object",
                                  properties: {
                                    unit: {
                                      type: "string",
                                      enum: [
                                        "unit",
                                        "dozen",
                                        "gram",
                                        "kilogram",
                                        "tonne",
                                        "litre",
                                        "millilitre",
                                      ],
                                    },
                                    value: {
                                      type: "string",
                                    },
                                  },
                                  required: ["unit", "value"],
                                },
                                count: {
                                  type: "string",
                                },
                              },
                              required: ["measure", "count"],
                            },
                            maximum: {
                              type: "object",
                              properties: {
                                measure: {
                                  type: "object",
                                  properties: {
                                    unit: {
                                      type: "string",
                                      enum: [
                                        "unit",
                                        "dozen",
                                        "gram",
                                        "kilogram",
                                        "tonne",
                                        "litre",
                                        "millilitre",
                                      ],
                                    },
                                    value: {
                                      type: "string",
                                    },
                                  },
                                  required: ["unit", "value"],
                                },
                                count: {
                                  type: "string",
                                },
                              },
                              required: ["measure", "count"],
                            },
                          },
                          required: ["unitized", "available", "maximum"],
                        },
                        category_ids: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        fulfillment_ids: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        location_ids: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        payment_ids: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        "add-ons": {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                              },
                              descriptor: {
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
                                      type: "object",
                                      properties: {
                                        url: {
                                          type: "string",
                                        },
                                      },
                                      required: ["url"],
                                    },
                                  },
                                },
                                required: [
                                  "name",
                                  "short_desc",
                                  "long_desc",
                                  "images",
                                ],
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
                                  offered_value: {
                                    type: "string",
                                  },
                                  maximum_value: {
                                    type: "string",
                                  },
                                },
                                required: [
                                  "currency",
                                  "value",
                                  "offered_value",
                                  "maximum_value",
                                ],
                              },
                            },
                            required: ["id", "descriptor", "price"],
                          },
                        },
                        cancellation_terms: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              fulfillment_state: {
                                type: "object",
                                properties: {
                                  descriptor: {
                                    type: "object",
                                    properties: {
                                      code: {
                                        type: "string",
                                      },
                                    },
                                    required: ["code"],
                                  },
                                },
                                required: ["descriptor"],
                              },
                              refund_eligible: {
                                type: "string",
                              },
                              return_policy: {
                                type: "object",
                                properties: {
                                  return_eligible: {
                                    type: "string",
                                  },
                                  return_within: {
                                    type: "string",
                                  },
                                  fulfillment_managed_by: {
                                    type: "string",
                                  },
                                  return_location: {
                                    type: "object",
                                    properties: {
                                      address: {
                                        type: "string",
                                      },
                                      gps: {
                                        type: "string",
                                      },
                                    },
                                    required: ["address", "gps"],
                                  },
                                },
                                required: [
                                  "return_eligible",
                                  "return_within",
                                  "fulfillment_managed_by",
                                  "return_location",
                                ],
                              },
                            },
                            if: {
                              properties: {
                                fulfillment_state: {
                                  properties: {
                                    descriptor: {
                                      properties: {
                                        code: {
                                          const: "Order-delivered",
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                            then: {
                              required: ["fulfillment_state", "return_policy"],
                            },
                            else: {
                              required: [
                                "fulfillment_state",
                                "refund_eligible",
                              ],
                            },
                          },
                        },
                        replacement_terms: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              replace_within: {
                                type: "string",
                              },
                            },
                            required: ["replace_within"],
                          },
                        },
                        time: {
                          type: "object",
                          properties: {
                            label: {
                              type: "string",
                            },
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
                          required: ["label", "range"],
                        },
                        matched: {
                          type: "string",
                        },
                        recommended: {
                          type: "string",
                        },
                        tags: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              descriptor: {
                                properties: {
                                  code: {
                                    type: "string",
                                  },
                                },
                              },

                              list: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    descriptor: {
                                      properties: {
                                        code: {
                                          type: "string",
                                        },
                                      },
                                    },
                                    value: {
                                      type: "string",
                                    },
                                  },
                                  required: ["descriptor", "value"],
                                },
                              },
                            },
                            required: ["descriptor", "list"],
                          },
                        },
                      },
                      required: [
                        "id",

                        "descriptor",
                        "creator",
                        "price",
                        "quantity",
                        "category_ids",
                        "fulfillment_ids",
                        "location_ids",
                        "payment_ids",
                        "cancellation_terms",
                        "replacement_terms",

                        "matched",
                        "recommended",
                      ],
                    },
                  },
                  offers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        descriptor: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                            code: {
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
                                type: "object",
                                properties: {
                                  url: {
                                    type: "string",
                                  },
                                },
                                required: ["url"],
                              },
                            },
                          },
                          required: [
                            "name",
                            "code",
                            "short_desc",
                            "long_desc",
                            "images",
                          ],
                        },
                        location_ids: {
                          type: "array",
                          items: {},
                        },
                        category_ids: {
                          type: "array",
                          items: {},
                        },
                        item_ids: {
                          type: "array",
                          items: {},
                        },
                        time: {
                          type: "object",
                          properties: {
                            label: {
                              type: "string",
                            },
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
                          required: ["label", "range"],
                        },
                      },
                      required: [
                        "id",
                        "descriptor",
                        "location_ids",
                        "category_ids",
                        "item_ids",
                        "time",
                      ],
                    },
                  },
                  fulfillments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        contact: {
                          type: "object",
                          properties: {
                            phone: {
                              type: "string",
                            },
                            email: {
                              type: "string",
                            },
                          },
                          required: ["phone", "email"],
                        },
                      },
                      required: ["contact"],
                    },
                  },
                },
                required: [
                  "id",
                  "descriptor",
                  "ttl",
                  "locations",
                  "tags",
                  "items",
                  "fulfillments",
                ],
              },
            },
          },
          additionalProperties:false,
          required: ["fulfillments", "payments", "descriptor", "providers"],
        },
      },
      required: ["catalog"],
    },
    search: {
      type: "array",
      items: {
        $ref: "searchSchema#",
      },
    },
  },
  required: ["context", "message"],
};
