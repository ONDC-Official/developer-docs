onSearchRules = [
  {
    if: { properties: { "@ondc/org/returnable": { const: false } } },
    then: {
      not: {
        required: ["@ondc/org/return_window"],
        error_message: "return window is available when returnable is false",
      },
    },
  },

  {
    if: { properties: { category_id: { const: "F&B" } } },
    then: {
      required: ["@ondc/org/fssai_license_no"],
    },
  },
  {
    if: { properties: { category_id: { const: "Packaged Foods" } } },
    then: {
      required: ["@ondc/org/fssai_license_no"],
    },
  },

  {
    if: { properties: { "@ondc/org/returnable": { const: false } } },
    then: {
      required: ["@ondc/org/return_window"],
    },
  },

  {
    if: {
      properties: {
        category_id: {
          const: "Packaged Commodities",
        },
      },
    },
    then: {
      required: ["@ondc/org/statutory_reqs_packaged_commodities"],
    },
  },

  {
    if: {
      properties: {
        category_id: {
          const: "Packaged Foods",
        },
      },
    },
    then: {
      required: ["@ondc/org/statutory_reqs_prepackaged_food"],
    },
  },
  {
    if: {
      properties: {
        category_id: {
          const: "fruits and vegetables",
        },
      },
    },
    then: {
      required: ["@ondc/org/mandatory_reqs_veggies_fruits"],
    },
  },

  {
    if: { properties: { category_id: { const: "F&B" } } },
    then: {
      required: ["tags"],
    },
  },
  {
    if: { properties: { category_id: { const: "Packaged Foods" } } },
    then: {
      required: ["tags"],
    },
  },
  {
    if: {
      properties: {
        category_id: {
          const: "f&b",
        },
      },
    },
    then: {
      properties: {
        descriptor: {
          required: ["name", "symbol", "short_desc", "long_desc"],
        },
      },
    },
    else: {
      properties: {
        descriptor: {
          required: ["name", "symbol", "short_desc", "long_desc", "images"],
        },
      },
    },
  },
];
module.exports = { onSearchRules };
