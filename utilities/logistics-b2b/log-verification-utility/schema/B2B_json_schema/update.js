module.exports = {
  $id: "http://example.com/schema/updateSchema",
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          const: "ONDC:RET10",
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
          const: "update",
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
          const: { $data: "/select/0/context/transaction_id" },
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
          const: "PT30S",
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
        update_target: {
          type: "string",
          enum:["fulfillment","item"]
        },
        order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              const: { $data: "/confirm/0/message/order/id" },
            },
            state: {
              type: "string",
            },
            provider: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  const: { $data: "/select/0/message/order/provider/id" },
                },
              },
              required: ["id"],
            },
            items: {
              type: "array",
              items: 
                {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    quantity: {
                      type: "object",
                      properties: {
                        selected: {
                          type: "object",
                          properties: {
                            count: {
                              type: "integer",
                            },
                          },
                          required: ["count"],
                        },
                      },
                      required: ["selected"],
                    },
                  },
                  required: ["id", "quantity"],
                },
              
            },
            payments: {
              type: "array",
              items: 
                {
                  type: "object",
                  properties: {
                    uri: {
                      type: "string",
                    },
                    tl_method: {
                      type: "string",
                    },
                    params: {
                      type: "object",
                      properties: {
                        currency: {
                          type: "string",
                        },
                        transaction_id: {
                          type: "string",
                        },
                        amount: {
                          type: "string",
                        },
                      },
                      required: ["currency", "amount"],
                    },
                    status: {
                      type: "string",
                      enum: ["PAID", "NOT-PAID"],
                    },
                    type: {
                      type: "string",
                      enum: [
                        "PRE-FULFILLMENT",
                        "ON-FULFILLMENT",
                        "POST-FULFILLMENT",
                      ],
                    },
                    collected_by: {
                      type: "string",
                    },
                    "@ondc/org/buyer_app_finder_fee_type": {
                      type: "string",
                    },
                    "@ondc/org/buyer_app_finder_fee_amount": {
                      type: "string",
                    },
                    "@ondc/org/settlement_details": {
                      type: "array",
                      items: 
                        {
                          type: "object",
                          properties: {
                            settlement_counterparty: {
                              type: "string",
                            },
                            settlement_phase: {
                              type: "string",
                            },
                            settlement_type: {
                              type: "string",
                            },
                            upi_address: {
                              type: "string",
                            },
                            settlement_bank_account_no: {
                              type: "string",
                            },
                            settlement_ifsc_code: {
                              type: "string",
                            },
                            beneficiary_name: {
                              type: "string",
                            },
                            bank_name: {
                              type: "string",
                            },
                            branch_name: {
                              type: "string",
                            },
                          },
                          allOf: [
                            {
                              if: {
                                properties: {
                                  settlement_type: {
                                    const: "upi",
                                  },
                                },
                              },
                              then: {
                                required: ["upi_address"],
                              },
                            },
                            {
                              if: {
                                properties: {
                                  settlement_type: {
                                    const: ["neft", "rtgs"],
                                  },
                                },
                              },
                              then: {
                                required: [
                                  "settlement_ifsc_code",
                                  "settlement_bank_account_no",
                                ],
                              },
                            },
                          ],
                          required: [
                            "settlement_counterparty",
                            "settlement_type",
                          ],
                        },
                      
                    },
                  },
                  required: [
                    "uri",
                    "tl_method",
                    "params",
                    "status",
                    "type",
                    "collected_by",
                    "@ondc/org/buyer_app_finder_fee_type",
                    "@ondc/org/buyer_app_finder_fee_amount",
                  ],
                },
              
            },
          },
          additionalProperties:false,
          required: ["id", "state", "provider", "items", "payments"],
        },
      },
      required: ["update_target", "order"],
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
    select: {
      type: "array",
      items: {
        $ref: "selectSchema#",
      },
    },
    on_select: {
      type: "array",
      items: {
        $ref: "onSelectSchema#",
      },
    },
    init: {
      type: "array",
      items: {
        $ref: "initSchema#",
      },
    },
    on_init: {
      type: "array",
      items: {
        $ref: "onInitSchema#",
      },
    },
    confirm: {
      type: "array",
      items: {
        $ref: "confirmSchema#",
      },
    },
    on_confirm: {
      type: "array",
      items: {
        $ref: "onConfirmSchema#",
      },
    },
  },
  required: ["context", "message"],
};
