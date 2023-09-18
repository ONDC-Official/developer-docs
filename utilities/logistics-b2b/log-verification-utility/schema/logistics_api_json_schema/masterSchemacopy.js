module.exports = {
  $id: "http://example.com/schema/masterSchemaCopy",
  type: "object",
  properties: {
    search: {
      $ref: "searchSchema1#",
    },
    on_search: {
      $ref: "onSearchSchema1#",
    },
  },
};
