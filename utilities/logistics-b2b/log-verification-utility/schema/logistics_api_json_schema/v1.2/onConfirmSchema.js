const constants = require("../../../utils/constants");
module.exports = {
  $id: "http://example.com/schema/onConfirmSchema",
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
          const: {
            $data: "/on_search/0/context/city",
          },
        },
        action: {
          type: "string",
          const: "on_confirm",
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
          const: {
            $data: "/search/0/context/transaction_id",
          },
          errorMessage:
            "Transaction ID should be same across the transaction: ${/search/0/context/transaction_id}",
        },
        message_id: {
          type: "string",
          allOf: [
            {
              const: {
                $data: "/confirm/0/context/message_id",
              },
              errorMessage:
                "Message ID for on_action API should be same as action API: ${/confirm/0/context/message_id}",
            },
            {
              not: {
                const: { $data: "1/transaction_id" },
              },
              errorMessage:
                "Message ID should not be equal to transaction_id: ${1/transaction_id}",
            },
            {
              not: {
                const: {
                  $data: "/init/0/context/message_id",
                },
              },
              errorMessage: "Message ID should be unique",
            },
            {
              not: {
                const: {
                  $data: "/search/0/context/message_id",
                },
              },
              errorMessage: "Message ID should be unique",
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
                $data: "/confirm/0/message/order/id",
              },
            },
            state: {
              type: "string",
              enum: ["Created", "Accepted", "Cancelled"],
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: {
                    $data: "/on_cancel/0/message/order/provider/id",
                  },
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
                      },
                    },
                    required: ["id"],
                  },
                },
              },
              required: ["id"],
              // oneOf: [
              //   {
              //     required: [
              //       "/confirm/0/message/order/provider/locations",
              //       "locations",
              //     ],
              //   },
              //   {
              //     not: {
              //       required: [
              //         "/confirm/0/message/order/provider/locations",
              //         "locations",
              //       ],
              //     },
              //   },
              // ],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    const: {
                      $data: "/init/0/message/order/items/0/id",
                    },
                  },
                  fulfillment_id: {
                    type: "string",
                    const: {
                      $data: "/init/0/message/order/items/0/fulfillment_id",
                    },
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
                  type: "object",
                  properties: {
                    currency: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      const: {
                        $data: "/confirm/0/message/order/quote/price/value",
                      },
                      errorMessage: "mismatches from /confirm",
                    },
                  },
                  required: ["currency", "value"],
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
                        enum: constants.TITLE_TYPE,
                      },
                      price: {
                        type: "object",
                        properties: {
                          currency: {
                            type: "string",
                            const: "INR",
                          },
                          value: {
                            type: "string",
                          },
                        },
                        required: ["currency", "value"],
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
              additionalProperties: false,
              required: ["price", "breakup"],
            },
            fulfillments: {
              type: "array",
              minItems:1,
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
                    const: {
                      $data: "/confirm/0/message/order/fulfillments/0/type",
                    },
                  },
                  state: {
                    type: "object",
                    properties: {
                      descriptor: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            const: "Pending",
                          },
                        },
                        required: ["code"],
                      },
                    },
                    required: ["descriptor"],
                  },
                  "@ondc/org/awb_no": {
                    type: "string",
                    pattern: "^[0-9]{11,16}$",
                    errorMessage: "should be 11-16 digits",
                    const: {
                      $data:
                        "/confirm/0/message/order/fulfillments/0/@ondc~1org~1awb_no",
                    },
                  },
                  tracking: {
                    type: "boolean",
                  },
                  start: {
                    type: "object",
                    properties: {
                      person: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            const: {
                              $data:
                                "/confirm/0/message/order/fulfillments/0/start/person/name",
                            },
                          },
                        },
                        required: ["name"],
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                            const: {
                              $data:
                                "/confirm/0/message/order/fulfillments/0/start/location/gps",
                            },
                            errorMessage:
                              "does not match start location in /confirm",
                          },
                          address: {
                            allOf: [
                              {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    minLength: 3,
                                    not: { const: { $data: "1/locality" } },
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
                              {
                                $data:
                                  "/confirm/0/message/order/fulfillments/0/start/location/address",
                              },
                            ],
                          },
                        },
                        required: ["gps", "address"],
                      },
                      contact: {
                        allOf: [
                          {
                            type: "object",
                            properties: {
                              phone: {
                                type: "string",
                              },
                              email: {
                                type: "string",
                              },
                            },
                            required: ["phone"],
                          },
                          {
                            $data:
                              "/confirm/0/message/order/fulfillments/0/start/contact",
                          },
                        ],
                      },
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
                          },
                          code: {
                            type: "string",
                            enum: constants.PCC_CODE,
                          },
                        },
                        required: ["code", "short_desc"],
                        allOf: [
                          {
                            if: { properties: { code: { const: "1" } } },
                            then: {
                              properties: {
                                short_desc: {
                                  minLength: 10,
                                  maxLength: 10,
                                  pattern: "^[0-9]{10}$",
                                  errorMessage: "should be a 10 digit number",
                                },
                              },
                            },
                          },
                          {
                            if: {
                              properties: { code: { enum: ["2", "3", "4"] } },
                            },
                            then: {
                              properties: {
                                short_desc: {
                                  maxLength: 6,
                                  pattern: "^[a-zA-Z0-9]{1,6}$",
                                  errorMessage:
                                    "should not be an empty string or have more than 6 digits",
                                },
                              },
                            },
                          },
                        ],
                      },
                      time: {
                        type: "object",
                        properties: {
                          duration: {
                            type: "string",
                          },
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
                            required: ["start", "end"],
                          },
                        },
                      },
                    },
                    required: ["person", "location", "contact"],
                  },

                  end: {
                    type: "object",
                    properties: {
                      person: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            const: {
                              $data:
                                "/confirm/0/message/order/fulfillments/0/end/person/name",
                            },
                          },
                        },
                        required: ["name"],
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string",
                            const: {
                              $data:
                                "/confirm/0/message/order/fulfillments/0/end/location/gps",
                            },
                            errorMessage:
                              "does not match start location in /confirm",
                          },
                          address: {
                            allOf: [
                              {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    minLength: 3,
                                    not: { const: { $data: "1/locality" } },
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
                              {
                                $data:
                                  "/confirm/0/message/order/fulfillments/0/end/location/address",
                              },
                            ],
                          },
                        },
                        required: ["gps", "address"],
                      },
                      contact: {
                        allOf: [
                          {
                            type: "object",
                            properties: {
                              phone: {
                                type: "string",
                              },
                              email: {
                                type: "string",
                              },
                            },
                            required: ["phone"],
                          },
                          {
                            $data:
                              "/confirm/0/message/order/fulfillments/0/end/contact",
                          },
                        ],
                      },
                      instructions: {
                        type: "object",
                        properties: {
                          short_desc: {
                            type: "string",
                            not: {
                              const: {
                                $data: "3/start/instructions/short_desc",
                              },
                            },
                            errorMessage:
                              "cannot be same as PCC - ${3/start/instructions/short_desc}",
                          },
                          long_desc: {
                            type: "string",
                          },
                          code: {
                            type: "string",
                            enum: constants.DCC_CODE,
                          },
                        },
                        required: ["code"],
                        allOf: [
                          {
                            if: { properties: { code: { const: "3" } } },
                            then: {
                              properties: {
                                short_desc: {
                                  maxLength: 0,
                                  errorMessage: "is not required",
                                },
                              },
                            },
                          },
                          {
                            if: {
                              properties: { code: { enum: ["1", "2"] } },
                            },
                            then: {
                              properties: {
                                short_desc: {
                                  maxLength: 6,
                                  pattern: "^[a-zA-Z0-9]{1,6}$",
                                  errorMessage:
                                    "should not be an empty string or have more than 6 digits",
                                },
                              },
                              required: ["short_desc"],
                            },
                          },
                        ],
                      },
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
                            required: ["start", "end"],
                          },
                        },
                      },
                    },
                    required: ["person", "location", "contact"],
                  },
                  agent: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      phone: { type: "string" },
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
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: constants.FULFILLMENT_TAGS_LIST_CODE,
                              },
                              value: {
                                type: "string",
                                enum: constants.FULFILLMENT_TAGS_LIST_VALUE,
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
                required: [
                  "id",
                  "type",
                  "state",
                  "start",
                  "tracking",
                  "end",
                  "tags",
                ],
              },
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
                    "mismatches in /billing in /confirm and /on_confirm",
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
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                    building: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/building",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                    locality: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/locality",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                    city: {
                      type: "string",
                      const: {
                        $data: "/confirm/0/message/order/billing/address/city",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                    state: {
                      type: "string",
                      const: {
                        $data: "/confirm/0/message/order/billing/address/state",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                    country: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/country",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                    area_code: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/billing/address/area code",
                      },
                      errorMessage:
                        "mismatches in /billing in /confirm and /on_confirm",
                    },
                  },
                  additionalProperties: false,
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
                    "mismatches in /billing in /confirm and /on_confirm",
                },
                phone: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/phone",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_confirm",
                },
                email: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/email",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_confirm",
                },
                created_at: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/created_at",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_confirm",
                },
                updated_at: {
                  type: "string",
                  const: {
                    $data: "/confirm/0/message/order/billing/updated_at",
                  },
                  errorMessage:
                    "mismatches in /billing in /confirm and /on_confirm",
                },
              },
              additionalProperties: false,
              required: [
                "name",
                "address",
                "phone",
                "tax_number",
                "created_at",
                "updated_at",
              ],
            },
            payment: {
              allOf: [
                {
                  $ref: "confirmSchema#/properties/message/properties/order/properties/payment",
                },
                {
                  $data: "/confirm/0/message/order/payment",
                },
              ],
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
                        enum: constants.CATEGORIES,
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
                                enum: constants.UNITS_WEIGHT,
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
                provider: {
                  type: "object",
                  properties: {
                    descriptor: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                      },
                      required: ["name"],
                    },
                    address: {
                      type: "object",
                      properties: {
                        name: {
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
                        area_code: {
                          type: "string",
                        },
                      },

                      required: [
                        "name",
                        "locality",
                        "city",
                        "state",
                        "area_code",
                      ],
                    },
                  },
                  required: ["descriptor", "address"],
                },
                order: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      const: {
                        $data:
                          "/confirm/0/message/order/@ondc~1org~1linked_order/order/id",
                      },
                    },
                    weight: {
                      type: "object",
                      properties: {
                        unit: {
                          type: "string",
                          enum: constants.UNITS_WEIGHT,
                        },
                        value: {
                          type: "number",
                          const: {
                            $data:
                            "/confirm/0/message/order/@ondc~1org~1linked_order/order/weight/value",
                          },
                          errorMessage:
                            "Payload weight mismatches from /search",
                        },
                      },
                      required: ["unit", "value"],
                    },
                    dimensions: {
                      type: "object",
                      properties: {
                        length: {
                          type: "object",
                          properties: {
                            unit: {
                              type: "string",
                              enum: constants.UNITS_DIMENSIONS,
                            },
                            value: {
                              type: "number",
                            },
                          },
                          required: ["unit", "value"],
                        },
                        breadth: {
                          type: "object",
                          properties: {
                            unit: {
                              type: "string",
                              enum: constants.UNITS_DIMENSIONS,
                            },
                            value: {
                              type: "number",
                            },
                          },
                          required: ["unit", "value"],
                        },
                        height: {
                          type: "object",
                          properties: {
                            unit: {
                              type: "string",
                              enum: constants.UNITS_DIMENSIONS,
                            },
                            value: {
                              type: "number",
                            },
                          },
                          required: ["unit", "value"],
                        },
                      },
                      required: ["length", "breadth", "height"],
                    },
                  },
                  required: ["id", "weight"],
                },
              },
              required: ["items", "provider", "order"],
            },
            created_at: {
              type: "string",
              const: {
                $data: "/confirm/0/message/order/created_at",
              },
              errorMessage: "mismatches in /confirm and /on_confirm",
            },
            updated_at: {
              type: "string",
              not: { const: { $data: "/confirm/0/message/order/created_at" } },
              errorMessage: "should not be same as 'created_at'",
            },
          },
          required: [
            "id",
            "state",
            "provider",
            "items",
            "quote",
            "fulfillments",
            "created_at",
            "updated_at",
            "@ondc/org/linked_order",
            "payment",
          ],
        },
      },
      required: ["order"],
    },
  },
  required: ["context", "message"],
};
