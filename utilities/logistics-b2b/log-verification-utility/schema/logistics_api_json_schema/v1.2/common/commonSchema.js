module.exports = {
  $id: "http://example.com/schema/commonSchema",
  type: "object",
  properties: {
    addressFormat: {
      type: "object",
      properties: {
        person: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
          },
        },
        location: {
          type: "object",
          properties: {
            gps: {
              type: "string",
              pattern:
                "^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
              errorMessage: "Incorrect gps value",
            },
            address: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 3,
                  not: { const: { $data: "1/locality" } },
                  errorMessage: "cannot be equal to locality",
                },
                building: {
                  type: "string",
                  minLength: 3,
                  not: { const: { $data: "1/locality" } },
                  errorMessage: "cannot be equal to locality",
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
              isLengthValid: true,
              errorMessage: "name + building + locality < 190 chars",
            },
          },
          required: ["gps", "address"],
        },
        contact: {
          type: "object",
          properties: {
            phone: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
          },
          required: ["phone", "email"],
        },
      },
      required: ["person", "location", "contact"],
    },
    priceFormat: {
      type: "object",
      properties: {
        currency: { type: "string" },
        value: { type: "string" },
      },
      required: ["currency", "value"],
    },
  },
};
