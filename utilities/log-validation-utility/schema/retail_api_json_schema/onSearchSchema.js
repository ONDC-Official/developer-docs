const onSearchItemValidations = require("./onSearchItemValidations");
const utils = require("../../utils/utils");
const constants = require("../../utils/constants");
module.exports = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: { type: "string", const: "nic2004:52110" },
        country: { type: "string" },
        city: { type: "string" },
        action: { type: "string", const: "on_search" },
        core_version: { type: "string", const: "1.1.0" },
        bap_id: { type: "string" },
        bap_uri: { type: "string" },
        transaction_id: { type: "string" },
        message_id: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
        ttl: { type: "string", format: "duration" },
        bpp_uri: { type: "string" },
        bpp_id: { type: "string" },
      },
    },
    message: {
      type: "object",
      properties: {
        catalog: {
          type: "object",
          properties: {
            "bpp/fulfillments": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: {
                    type: "string",
                    enum: [
                      "Delivery",
                      "Self-Pickup",
                      "Delivery and Self-Pickup",
                    ],
                  },
                },
              },
            },
            "bpp/descriptor": {
              type: "object",
              properties: {
                name: { type: "string" },
                symbol: { type: "string" },
                short_desc: { type: "string" },
                long_desc: { type: "string" },
                images: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["name", "symbol", "long_desc", "short_desc", "images"],
            },
            "bpp/providers": {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  time: {
                    type: "object",
                    properties: {
                      label: { type: "string", enum: ["enable", "disable"] },
                      timestamp: { type: "string", format: "date-time" },
                    },
                    required: ["label", "timestamp"],
                  },
                  descriptor: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      symbol: { type: "string" },
                      short_desc: { type: "string" },
                      long_desc: { type: "string" },
                      images: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                    required: [
                      "name",
                      "symbol",
                      "long_desc",
                      "short_desc",
                      "images",
                    ],
                  },
                  ttl: { type: "string", format: "duration" },
                  "@ondc/org/fssai_license_no": {
                    type: "string",
                    minLength: 14,
                    maxLength: 14,
                  },
                  locations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        gps: { type: "string" },
                        address: {
                          type: "object",
                          properties: {
                            street: {
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
                          required: ["street", "city", "area_code", "state"],
                        },

                        circle: {
                          type: "object",
                          properties: {
                            gps: {
                              type: "string",
                            },
                            radius: {
                              type: "object",
                              properties: {
                                unit: {
                                  type: "string",
                                },
                                value: {
                                  type: "string",
                                },
                              },
                            },
                          },
                        },
                        time: {
                          type: "object",

                          properties: {
                            days: {
                              type: "string",
                            },
                            range: {
                              type: "object",
                              properties: {
                                start: {
                                  type: "string",
                                  minLength: 4,
                                  maxLength: 4,
                                },
                                end: {
                                  type: "string",
                                  minLength: 4,
                                  maxLength: 4,
                                },
                              },
                              required: ["start", "end"],
                            },
                            schedule: {
                              type: "object",
                              properties: {
                                holidays: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                    format: "date",
                                  },
                                },
                                frequency: {
                                  type: "string",
                                  format: "duration",
                                },
                                times: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                },
                              },
                              required: ["holidays"],
                            },
                          },
                          required: ["days", "schedule"],
                        },
                      },
                      required: ["id", "address", "gps", "time"],
                    },
                  },
                  items: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        quantity: {
                          type: "object",
                          properties: {
                            maximum: {
                              type: "object",
                              properties: {
                                count: {
                                  type: "string",
                                },
                              },
                            },
                            available: {
                              type: "object",
                              properties: {
                                count: {
                                  type: "string",
                                },
                              },
                            },
                          },
                        },
                        category_id: {
                          type: "string",
                          enum: utils.allCategories,
                          errorMessage: `category_id should be one of the valid categories as defined in [enhanced sub-category list](${constants.ENHANCED_SUBCATEGORY_LIST})`,
                        },

                        fulfillment_id: { type: "string" },
                        location_id: { type: "string" },
                        recommended: { type: "boolean" },
                        "@ondc/org/returnable": {
                          type: "boolean",
                        },
                        "@ondc/org/seller_pickup_return": {
                          type: "boolean",
                        },
                        "@ondc/org/return_window": {
                          type: "string",
                        },
                        "@ondc/org/cancellable": {
                          type: "boolean",
                        },
                        "@ondc/org/time_to_ship": {
                          type: "string",
                          format: "duration",
                        },
                        "@ondc/org/available_on_cod": {
                          type: "boolean",
                        },
                        "@ondc/org/contact_details_consumer_care": {
                          type: "string",
                        },
                        price: {
                          type: "object",
                          properties: {
                            currency: {
                              type: "string",
                            },
                            value: {
                              type: "string",
                              minLength: 1,
                              pattern: "^(\\d*.?\\d{1,2})$",
                              not: {
                                type: "string",
                                pattern: "^0$",
                              },
                            },

                            maximum_value: {
                              type: "string",
                              minLength: 1,
                              pattern: "^(\\d*.?\\d{1,2})$",
                              not: { type: "string", pattern: "^0$" },
                            },
                          },
                          required: ["value", "maximum_value", "currency"],
                        },
                        tags: {
                          type: "object",
                          properties: {
                            veg: {
                              type: "string",
                              enum: ["yes", "no"],
                            },
                            non_veg: {
                              type: "string",
                              enum: ["yes", "no"],
                            },
                          },
                          required: ["veg", "non_veg"],
                        },
                        "@ondc/org/statutory_reqs_prepackaged_food": {
                          type: "object",
                          properties: {
                            nutritional_info: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            importer_FSSAI_license_no: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            brand_owner_FSSAI_license_no: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            other_FSSAI_license_no: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            additives_info: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            imported_product_country_of_origin: {
                              type: "string",
                              pattern:
                                "/^A(BW|FG|GO|IA|L[AB]|ND|R[EGM]|SM|T[AFG]|U[ST]|ZE)|B(DI|E[LNS]|FA|G[DR]|H[RS]|IH|L[MRZ]|MU|OL|R[ABN]|TN|VT|WA)|C(A[FN]|CK|H[ELN]|IV|MR|O[DGKLM]|PV|RI|U[BW]|XR|Y[MP]|ZE)|D(EU|JI|MA|NK|OM|ZA)|E(CU|GY|RI|S[HPT]|TH)|F(IN|JI|LK|R[AO]|SM)|G(AB|BR|EO|GY|HA|I[BN]|LP|MB|N[BQ]|R[CDL]|TM|U[FMY])|H(KG|MD|ND|RV|TI|UN)|I(DN|MN|ND|OT|R[LNQ]|S[LR]|TA)|J(AM|EY|OR|PN)|K(AZ|EN|GZ|HM|IR|NA|OR|WT)|L(AO|B[NRY]|CA|IE|KA|SO|TU|UX|VA)|M(A[CFR]|CO|D[AGV]|EX|HL|KD|L[IT]|MR|N[EGP]|OZ|RT|SR|TQ|US|WI|Y[ST])|N(AM|CL|ER|FK|GA|I[CU]|LD|OR|PL|RU|ZL)|OMN|P(A[KN]|CN|ER|HL|LW|NG|OL|R[IKTY]|SE|YF)|QAT|R(EU|OU|US|WA)|S(AU|DN|EN|G[PS]|HN|JM|L[BEV]|MR|OM|PM|RB|SD|TP|UR|V[KN]|W[EZ]|XM|Y[CR])|T(C[AD]|GO|HA|JK|K[LM]|LS|ON|TO|U[NRV]|WN|ZA)|U(GA|KR|MI|RY|SA|ZB)|V(AT|CT|EN|GB|IR|NM|UT)|W(LF|SM)|YEM|Z(AF|MB|WE)$/ix".toString(),
                              errorMessage:
                                "country of origin must be in ISO 3166-1 alpha-3 code format",
                            },
                          },
                          required: [
                            "nutritional_info",
                            "additives_info",
                            "imported_product_country_of_origin",
                          ],
                          anyOf: [
                            {
                              required: ["importer_FSSAI_license_no"],
                              properties: {
                                importer_FSSAI_license_no: {
                                  type: "string",
                                },
                              },
                            },
                            {
                              required: ["brand_owner_FSSAI_license_no"],
                              properties: {
                                brand_owner_FSSAI_license_no: {
                                  type: "string",
                                },
                              },
                            },
                            {
                              required: ["other_FSSAI_license_no"],
                              properties: {
                                other_FSSAI_license_no: {
                                  type: "string",
                                },
                              },
                            },
                          ],
                        },
                        "@ondc/org/statutory_reqs_packaged_commodities": {
                          type: "object",
                          properties: {
                            manufacturer_or_packer_name: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            manufacturer_or_packer_address: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            common_or_generic_name_of_commodity: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            net_quantity_or_measure_of_commodity_in_pkg: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            month_year_of_manufacture_packing_import: {
                              type: "string",
                              pattern: "^(?!\\s*$).+",
                            },
                            imported_product_country_of_origin: {
                              type: "string",
                              pattern:
                                "/^A(BW|FG|GO|IA|L[AB]|ND|R[EGM]|SM|T[AFG]|U[ST]|ZE)|B(DI|E[LNS]|FA|G[DR]|H[RS]|IH|L[MRZ]|MU|OL|R[ABN]|TN|VT|WA)|C(A[FN]|CK|H[ELN]|IV|MR|O[DGKLM]|PV|RI|U[BW]|XR|Y[MP]|ZE)|D(EU|JI|MA|NK|OM|ZA)|E(CU|GY|RI|S[HPT]|TH)|F(IN|JI|LK|R[AO]|SM)|G(AB|BR|EO|GY|HA|I[BN]|LP|MB|N[BQ]|R[CDL]|TM|U[FMY])|H(KG|MD|ND|RV|TI|UN)|I(DN|MN|ND|OT|R[LNQ]|S[LR]|TA)|J(AM|EY|OR|PN)|K(AZ|EN|GZ|HM|IR|NA|OR|WT)|L(AO|B[NRY]|CA|IE|KA|SO|TU|UX|VA)|M(A[CFR]|CO|D[AGV]|EX|HL|KD|L[IT]|MR|N[EGP]|OZ|RT|SR|TQ|US|WI|Y[ST])|N(AM|CL|ER|FK|GA|I[CU]|LD|OR|PL|RU|ZL)|OMN|P(A[KN]|CN|ER|HL|LW|NG|OL|R[IKTY]|SE|YF)|QAT|R(EU|OU|US|WA)|S(AU|DN|EN|G[PS]|HN|JM|L[BEV]|MR|OM|PM|RB|SD|TP|UR|V[KN]|W[EZ]|XM|Y[CR])|T(C[AD]|GO|HA|JK|K[LM]|LS|ON|TO|U[NRV]|WN|ZA)|U(GA|KR|MI|RY|SA|ZB)|V(AT|CT|EN|GB|IR|NM|UT)|W(LF|SM)|YEM|Z(AF|MB|WE)$/ix".toString(),
                              errorMessage:
                                "country of origin must be in ISO 3166-1 alpha-3 code format",
                            },
                          },
                          required: [
                            "manufacturer_or_packer_name",
                            "manufacturer_or_packer_address",
                            "common_or_generic_name_of_commodity",
                            "month_year_of_manufacture_packing_import",
                            "net_quantity_or_measure_of_commodity_in_pkg",
                            "imported_product_country_of_origin",
                          ],
                        },
                        "@ondc/org/mandatory_reqs_veggies_fruits": {
                          type: "object",
                          properties: {
                            net_quantity: {
                              type: "string",
                              minLength: 1,
                            },
                          },
                          required: ["net_quantity"],
                        },

                        descriptor: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            symbol: { type: "string" },
                            short_desc: {
                              type: "string",
                            },
                            long_desc: {
                              type: "string",
                            },
                            images: {
                              type: "array",
                              minItems: 1,
                              maxItems: 3,
                              items: {
                                type: "string",
                              },
                            },
                          },
                        },
                      },

                      required: [
                        "id",
                        "category_id",
                        "@ondc/org/contact_details_consumer_care",
                        "price",
                        "descriptor",
                        "@ondc/org/returnable",
                        "location_id",
                        "fulfillment_id",
                        "@ondc/org/cancellable",
                        "@ondc/org/available_on_cod",
                        "@ondc/org/time_to_ship",
                      ],
                      allOf: onSearchItemValidations.onSearchRules,
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
                              minLength: 10,
                              maxLength: 11,
                            },
                            email: { type: "string", format: "email" },
                          },
                          required: ["phone"],
                        },
                      },
                      required: ["contact"],
                    },
                  },

                  tags: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      properties: {
                        code: { type: "string", const: "serviceability" },
                        list: {
                          type: "array",
                          minItems: 5,
                          maxItems: 5,
                          items: {
                            type: "object",
                            properties: {
                              code: {
                                type: "string",
                                enum: [
                                  "location",
                                  "category",
                                  "type",
                                  "val",
                                  "unit",
                                ],
                              },
                              value: { type: "string" },
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
                  "items",
                  "id",
                  "time",
                  "descriptor",
                  "locations",
                  "fulfillments",
                  "tags",
                  "ttl",
                ],
              },
            },
          },
          required: ["bpp/fulfillments", "bpp/descriptor", "bpp/providers"],
        },
      },
      required: ["catalog"],
    },
  },
  required: ["context", "message"],
};
