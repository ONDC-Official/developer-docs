module.exports = {
  $id: "http://example.com/schema/masterSchema",
  type: "object",
  properties: {
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
    update: {
      type: "array",
      items: {
        $ref: "updateSchema#",
      },
    },
    on_update: {
      type: "array",
      items: {
        $ref: "onUpdateSchema#",
      },
    },
    status: {
      type: "array",
      items: {
        $ref: "statusSchema#",
      },
    },
    on_status: {
      type: "array",
      items: {
        $ref: "onStatusSchema#",
      },
    }
  },
};
