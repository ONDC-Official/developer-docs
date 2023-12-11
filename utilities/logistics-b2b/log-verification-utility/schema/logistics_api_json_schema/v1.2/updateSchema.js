const {
  PCC_CODE,
  DCC_CODE,
  FULFILLMENT_TAGS_LIST_CODE,
  FULFILLMENT_TAGS_LIST_VALUE,
} = require("../../../utils/constants");
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
          const: {
            $data: "/on_search/0/context/properties/city",
          },
        },
        action: {
          type: "string",
          const: "update",
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
          const: "fulfillment",
        },
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              const: {
                $data: "/confirm/0/message/order/id",
              },
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    const: {
                      $data: "/confirm/0/message/order/items/0/id",
                    },
                  },
                  category_id: {
                    type: "string",
                    const: {
                      $data: "/confirm/0/message/order/items/0/category_id",
                    },
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        const: {
                          $data:
                            "/confirm/0/message/order/items/0/descriptor/code",
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
                  start: {
                    type: "object",
                    properties: {
                      instructions: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            enum: PCC_CODE,
                          },
                          name: {
                            type: "string",
                          },
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
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
                    },
                    additionalProperties: false,
                    // required: ["instructions"],
                  },
                  end: {
                    type: "object",
                    properties: {
                      instructions: {
                        type: "object",
                        properties: {
                          code: {
                            type: "string",
                            enum: DCC_CODE,
                          },
                          name: {
                            type: "string",
                          },
                          short_desc: {
                            type: "string",
                          },
                          long_desc: {
                            type: "string",
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
                    },
                    additionalProperties: false,
                    // required: ["instructions"],
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                          enum: ["state"]
                        },
                        list: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: ["ready_to_ship"]
                              },
                              value: {
                                type: "string",
                                enum: ["yes","no"]
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
                additionalProperties: false,
                required: ["id", "type", "tags"],
              },
            },
            "@ondc/org/linked_order": {
              allOf: [
                {
                  $merge: {
                    source: {
                      $ref: "confirmSchema#/properties/message/properties/order/properties/@ondc~1org~1linked_order",
                    },
                    with: {
                      required: ["items", "order"],
                    },
                  },
                },
                {
                  $data: "/confirm/0/message/order/@ondc~1org~1linked_order",
                },
              ],
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
         
          required: ["id", "items", "fulfillments", "updated_at"],
        },
      },
      required: ["update_target", "order"],
    },
  },
  
  required: ["context", "message"],
};
