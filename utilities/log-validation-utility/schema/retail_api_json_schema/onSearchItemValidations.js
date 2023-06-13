onSearchRules = [
  // {
  //   if: { properties: { "@ondc/org/returnable": { const: false } } },
  //   then: {
  //     required: ["@ondc/org/return_window"],
  //   },
  // },

  {
    if: {
      properties: {
        category_id: {
          enum: [
            "Masala & Seasoning",
            "Oil & Ghee",
            "Foodgrains",
            "Eggs, Meat & Fish",
            "Cleaning & Household",
            "Beauty & Hygiene",
            "Kitchen Accessories",
            "Baby Care",
            "Pet Care",
            "Stationery",
          ],
        },
      },
    },
    then: {
      properties: {
        "@ondc/org/statutory_reqs_packaged_commodities": {
          type: "object",
        },
      },
      required: ["@ondc/org/statutory_reqs_packaged_commodities"],
    },
  },

  {
    if: {
      properties: {
        category_id: {
          enum: [
            "Gourmet & World Foods",
            "Beverages",
            "Bakery, Cakes & Dairy",
            "Snacks & Branded Foods",
          ],
        },
      },
    },
    then: {
      properties: {
        "@ondc/org/statutory_reqs_prepackaged_food": {
          type: "object",
        },
      },
      required: ["@ondc/org/statutory_reqs_prepackaged_food"],
    },
  },
  {
    if: {
      properties: {
        category_id: {
          const: "Fruits and Vegetables",
        },
      },
    },
    then: {
      properties: {
        "@ondc/org/mandatory_reqs_veggies_fruits": {
          type: "object",
        },
      },
      required: ["@ondc/org/mandatory_reqs_veggies_fruits"],
      errorMessage: `"@ondc/org/mandatory_reqs_veggies_fruits" is mandatory for "Fruits and Vegetables" category`,
    },
  },

  {
    if: {
      properties: {
        category_id: {
          enum: [
            "Continental",
            "Middle Eastern",
            "North Indian",
            "Pan-Asian",
            "Regional Indian",
            "South Indian",
            "Tex-Mexican",
            "World Cuisines",
            "Healthy Food",
            "Fast Food",
            "Desserts",
            "Bakes & Cakes",
            "Beverages (MTO)",
            "F&B",
            "Gourmet & World Foods",
            "Beverages",
            "Bakery, Cakes & Dairy",
            "Snacks & Branded Foods",
          ],
        },
      },
    },
    then: {
      properties: {
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
      },
      required: ["tags"],
      errorMessage: `veg/non-veg categorization is mandatory for F&B categories or packaged foods in /tags`,
    },
  },
  // {
  //   if: {
  //     properties: {
  //       category_id: {
  //         enum: [
  //           "Gourmet & World Foods",
  //           "Beverages",
  //           "Bakery, Cakes & Dairy",
  //           "Snacks & Branded Foods",
  //         ],
  //       },
  //     },
  //   },
  //   then: {
  //     required: ["tags"],
  //   },
  // },
  {
    if: {
      properties: {
        category_id: {
          enum: [
            "F&B",
            "Continental",
            "Middle Eastern",
            "North Indian",
            "Pan-Asian",
            "Regional Indian",
            "South Indian",
            "Tex-Mexican",
            "World Cuisines",
            "Healthy Food",
            "Fast Food",
            "Desserts",
            "Bakes & Cakes",
            "Beverages (MTO)",
          ],
        },
      },
    },
    then: {
      properties: {
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
          },
          required: ["name", "symbol", "short_desc", "long_desc"],
        },
      },
    },
    else: {
      properties: {
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
              items: {
                type: "string",
              },
            },
          },
          required: ["name", "symbol", "short_desc", "long_desc", "images"],
        },
      },
    },
  },
];
module.exports = { onSearchRules };
