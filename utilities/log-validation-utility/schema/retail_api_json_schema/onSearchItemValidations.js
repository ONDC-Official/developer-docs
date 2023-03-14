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
      required: ["@ondc/org/fssai_license_no"],
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
      required: ["@ondc/org/mandatory_reqs_veggies_fruits"],
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
          ],
        },
      },
    },
    then: {
      required: ["tags"],
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
      required: ["tags"],
    },
  },
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
