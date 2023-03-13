onSearchFashionSchema = {
    "type": "object",
    "properties": {
        "fulfillments": {"type": "array",
                         "items": {"type": "object",
                                   "properties": {
                                       "id": {"type": "string"},
                                       "type": {"type": "string"}
                                   },
                                   "required": ["id"]
                                   }
                         },
        "payments": {"type": "array",
                     "items": {"type": "object",
                               "properties": {
                                   "id": {"type": "string"},
                                   "type": {"type": "string"}
                               },
                               "required": ["id"]
                               }
                     },
        "descriptor": {"type": "object",
                       "properties": {
                           "name": {"type": "string"},
                           "short_desc": {"type": "string"},
                           "long_desc": {"type": "string"},
                            "images": {"type": "array",
                                                                  "items": {"type": "object",
                                                                            "properties": {
                                                                                "url": {
                                                                                    "type": "string",
                                                                                    "pattern": "^(?!\s*$).+"}
                                                                            },
                                                                            "required": ["url"]

                                                                            }
                                                                  },
                       }
                       },
        "providers": {"type": "array",
                      "items": {"type": "object",
                                "properties": {
                                    "id": {"type": "string", "pattern": "^(?!\s*$).+"},
                                    "descriptor": {"type": "object",
                                                   "properties": {
                                                       "name": {"type": "string"},
                                                       "code": {"type": "string"},
                                                       "short_desc": {"type": "string"},
                                                       "long_desc": {"type": "string"},
                                                       "images": {"type": "array",
                                                                  "items": {"type": "object",
                                                                            "properties": {
                                                                                "url": {
                                                                                    "type": "string",
                                                                                    "pattern": "^(?!\s*$).+"}
                                                                            },
                                                                            "required": ["url"]

                                                                            }
                                                                  },
                                                   }
                                                   },
                                    "rating": {"type": "string"},
                                    "ttl": {"type": "string"},
                                    "locations": {"type": "array",
                                                  "items": {"type": "object",
                                                            "properties": {
                                                                "id": {"type": "string"},
                                                                "gps": {"type": "string"},
                                                                "address": {"type": "string"},
                                                                "city": {"type": "object",
                                                                         "properties": {
                                                                             "code": {"type": "string"},
                                                                             "name": {"type": "string"},
                                                                         }
                                                                         },
                                                                "state": {"type": "object",
                                                                          "properties": {
                                                                              "code": {"type": "string"},
                                                                          }
                                                                          },
                                                                "country": {"type": "object",
                                                                            "properties": {
                                                                                "code": {"type": "string"},
                                                                            }
                                                                            },
                                                                "area_code": {"type": "string"},
                                                            }
                                                            }
                                                  },
                                    "tags": {"type": "array",
                                             "items": {"type": "object",
                                                       "properties": {
                                                           "code": {"type": "string"},
                                                           "list": {"type": "array",
                                                                    "items": {"type": "object",
                                                                              "properties": {
                                                                                  "code": {"type": "string"},
                                                                                  "value": {"type": "string"},
                                                                              }
                                                                              }}
                                                       }
                                                       }
                                             },
                                    "items": {"type": "array",
                                              "items": {"type": "object",
                                                        "properties": {
                                                            "id": {"type": "string", "pattern": "^(?!\s*$).+"},
                                                            "parent_item_id": {"type": "string",
                                                                               "pattern": "^(?!\s*$).+"},
                                                            "descriptor": {"type": "object",
                                                                           "properties": {
                                                                               "name": {"type": "string",
                                                                                        "pattern": "^(?!\s*$).+"},
                                                                               "code": {"type": "string",
                                                                                        "pattern": "^(?!\s*$).+"},
                                                                               "short_desc": {"type": "string"},
                                                                               "long_desc": {"type": "string"},
                                                                               "images": {"type": "array",
                                                                                          "items": {"type": "object",
                                                                                                    "properties": {
                                                                                                        "url": {
                                                                                                            "type": "string",
                                                                                                            "pattern": "^(?!\s*$).+"}
                                                                                                    },
                                                                                                    "required": ["url"]

                                                                                                    }
                                                                                          },
                                                                               "media": {"type": "array",
                                                                                         "items": {"type": "object",
                                                                                                   "properties": {
                                                                                                       "mimetype": {
                                                                                                           "type": "string",
                                                                                                           "pattern": "^(?!\s*$).+"},
                                                                                                       "url": {
                                                                                                           "type": "string",
                                                                                                           "pattern": "^(?!\s*$).+"}
                                                                                                   }
                                                                                                   }
                                                                                         },
                                                                           },
                                                                           },
                                                            "manufacturer": {"type": "object",
                                                                             "properties": {
                                                                                 "descriptor": {"type": "object",
                                                                                                "properties": {
                                                                                                    "name": {
                                                                                                        "type": "string"},
                                                                                                }
                                                                                                },
                                                                                 "contact": {"type": "object",
                                                                                             "properties": {
                                                                                                 "name": {
                                                                                                     "type": "string"},
                                                                                                 "address": {
                                                                                                     "type": "object",
                                                                                                     "properties": {
                                                                                                         "full": {
                                                                                                             "type": "string"},
                                                                                                     }
                                                                                                 },
                                                                                             }
                                                                                             },
                                                                                 "phone": {"type": "string",
                                                                                           "pattern": "^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}98(\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$"}
                                                                             }
                                                                             },
                                                            "price": {"type": "object",
                                                                      "properties": {
                                                                          "currency": {"type": "string",
                                                                                       "pattern": "^(?!\s*$).+"},
                                                                          "value": {"type": "string",
                                                                                    "pattern": "^\d*\.?\d*$"},
                                                                          "offered_value": {"type": "string",
                                                                                            "pattern": "^\d*\.?\d*$"},
                                                                          "maximum_value": {"type": "string",
                                                                                            "pattern": "^\d*\.?\d*$"}
                                                                      },
                                                                      "require": ["currency", "value"],
                                                                      },

                                                            "quantity": {"type": "object",
                                                                         "properties": {
                                                                             "unitized": {"type": "object",
                                                                                          "properties": {
                                                                                              "measure": {
                                                                                                  "type": "object",
                                                                                                  "properties": {
                                                                                                      "unit": {
                                                                                                          "type": "string"},
                                                                                                      "value": {
                                                                                                          "type": "string"}

                                                                                                  }
                                                                                              },
                                                                                          }
                                                                                          },
                                                                             "available": {"type": "object",
                                                                                           "properties": {
                                                                                               "count": {
                                                                                                   "type": "string",
                                                                                                   "pattern": "^\d*$"}

                                                                                           }
                                                                                           },
                                                                             "maximum": {"type": "object",
                                                                                         "properties": {
                                                                                             "count": {"type": "string",
                                                                                                       "pattern": "^\d*$"}
                                                                                         }
                                                                                         },
                                                                         }
                                                                         },
                                                            "category_ids": {"type": "array",
                                                                             "items": {
                                                                                 "type": "string", "minItems": 1,
                                                                                 "pattern": "^(?!\s*$).+"}},
                                                            "fulfillment_ids": {"type": "array",
                                                                                "items": {
                                                                                    "type": "string", "minItems": 1,
                                                                                    "pattern": "^(?!\s*$).+"}},
                                                            "location_ids": {"type": "array",
                                                                             "items": {
                                                                                 "type": "string",
                                                                                 "pattern": "^(?!\s*$).+"}},
                                                            "payment_ids": {"type": "array",
                                                                            "items": {
                                                                                "type": "string",
                                                                                "enum": ["1", "2"]}},
                                                            "add-ons": {"type": "array",
                                                                        "items": {"type": "object",
                                                                                  "properties": {
                                                                                      "id": {"type": "string"},
                                                                                      "descriptor": {"type": "object",
                                                                                                     "properties": {
                                                                                                         "name": {
                                                                                                             "type": "string"},
                                                                                                         "code": {
                                                                                                             "type": "string"},
                                                                                                         "short_desc": {
                                                                                                             "type": "string"},
                                                                                                         "long_desc": {
                                                                                                             "type": "string"},
                                                                                                         "images": {
                                                                                                             "type": "array",
                                                                                                             "items": {
                                                                                                                 "type": "object",
                                                                                                                 "properties": {
                                                                                                                     "url": {
                                                                                                                         "type": "string",
                                                                                                                         "pattern": "^(?!\s*$).+"}
                                                                                                                 },
                                                                                                                 "required": [
                                                                                                                     "url"]

                                                                                                             }
                                                                                                         }
                                                                                                     }
                                                                                                     },
                                                                                      "price": {"type": "object",
                                                                                                "properties": {
                                                                                                    "currency": {
                                                                                                        "type": "string",
                                                                                                        "pattern": "^(?!\s*$).+"},
                                                                                                    "value": {
                                                                                                        "type": "string",
                                                                                                        "pattern": "^\d*\.?\d*$"},
                                                                                                    "offered_value": {
                                                                                                        "type": "string"},
                                                                                                    "maximum_value": {
                                                                                                        "type": "string"}
                                                                                                }
                                                                                                },
                                                                                  }
                                                                                  }
                                                                        },
                                                            "cancellation_terms": {"type": "array",
                                                                                   "items": {"anyOf": [
                                                                                       {"type": "object",
                                                                                        "properties": {
                                                                                            "fulfillment_state": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                    "descriptor": {
                                                                                                        "type": "object",
                                                                                                        "properties": {
                                                                                                            "code": {
                                                                                                                "type": "string"}
                                                                                                        }
                                                                                                    },
                                                                                                }
                                                                                            },
                                                                                            "refund_eligible": {
                                                                                                "type": "string"},
                                                                                        },
                                                                                        "required": [
                                                                                            "fulfillment_state",
                                                                                            "refund_eligible"]
                                                                                        },
                                                                                       {"type": "object",
                                                                                        "properties": {
                                                                                            "fulfillment_state": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                    "descriptor": {
                                                                                                        "type": "object",
                                                                                                        "properties": {
                                                                                                            "code": {
                                                                                                                "type": "string"}
                                                                                                        }
                                                                                                    },
                                                                                                }
                                                                                            },
                                                                                            "return_policy": {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                    "return_eligible": {
                                                                                                        "type": "string"},
                                                                                                    "return_within": {
                                                                                                        "type": "string"},
                                                                                                    "fulfillment_managed_by": {
                                                                                                        "type": "string"},
                                                                                                    "return_location": {
                                                                                                        "type": "object",
                                                                                                        "properties": {
                                                                                                            "address": {
                                                                                                                "type": "string"},
                                                                                                            "gps": {
                                                                                                                "type": "string"}
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                "required": [
                                                                                                    "return_eligible",
                                                                                                    "return_within",
                                                                                                    "return_location",
                                                                                                ]
                                                                                            }
                                                                                        },
                                                                                        "required": [
                                                                                            "fulfillment_state",
                                                                                            "return_policy"]
                                                                                        }
                                                                                   ]},
                                                                                   "minLength": 2
                                                                                   },

                                                            "replacement_terms": {"type": "array",
                                                                                  "items": {"type": "object",
                                                                                            "properties": {
                                                                                                "replace_within": {
                                                                                                    "type": "string",
                                                                                                    "pattern": "^(?!\s*$).+"}
                                                                                            },
                                                                                            "required": [
                                                                                                "replace_within"]
                                                                                            }
                                                                                  },
                                                            "rating": {"type": "string"},
                                                            "matched": {"type": "string"},
                                                            "time": {"type": "object",
                                                                     "properties": {
                                                                         "label": {"type": "string"},
                                                                         "range": {"type": "object",
                                                                                   "properties": {
                                                                                       "start": {"type": "string",
                                                                                                 "pattern": "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$"},
                                                                                       "end": {"type": "string",
                                                                                               "pattern": "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$"}
                                                                                   }
                                                                                   },
                                                                     }
                                                                     },
                                                            "recommended": {"type": "string"},
                                                            "tags": {"type": "array",
                                                                     "items": {"type": "object",
                                                                               "properties": {
                                                                                   "code": {"type": "string"},
                                                                                   "list": {"type": "array",
                                                                                            "items": {"type": "object",
                                                                                                      "properties": {
                                                                                                          "code": {
                                                                                                              "type": "string"},
                                                                                                          "value": {
                                                                                                              "type": "string"},
                                                                                                      },
                                                                                                      "required": [
                                                                                                          "code",
                                                                                                          "value"]
                                                                                                      }
                                                                                            },
                                                                               }
                                                                               }
                                                                     }
                                                        },
                                                        "required": ["id", "parent_item_id", "descriptor",
                                                                     "manufacturer", "price", "quantity",
                                                                     "category_ids", "fulfillment_ids", "location_ids",
                                                                     "payment_ids",
                                                                     "cancellation_terms", "replacement_terms",
                                                                     "matched", "recommended", "tags"],
                                                        }
                                              },
                                    "fulfillments": {"type": "array",
                                                     "items": {"type": "object",
                                                               "properties": {
                                                                   "contact": {"type": "object",
                                                                               "properties": {
                                                                                   "phone": {"type": "string",
                                                                                             "pattern": "^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}98(\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$"},
                                                                                   "email": {"type": "string",
                                                                                             "pattern": "^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"}
                                                                               }
                                                                               }
                                                               },
                                                               }
                                                     },

                                    "offers": {"type": "array",
                                               "items": {"type": "object",
                                                         "properties": {
                                                             "id": {"type": "string"},
                                                             "descriptor": {"type": "object",
                                                                            "properties": {
                                                                                "name": {"type": "string"},
                                                                                "code": {"type": "string"},
                                                                                "short_desc": {"type": "string"},
                                                                                "long_desc": {"type": "string"},
                                                                                "images": {"type": "array",
                                                                                           "items": {"type": "object",
                                                                                                     "properties": {
                                                                                                         "url": {
                                                                                                             "type": "string",
                                                                                                             "pattern": "^(?!\s*$).+"}
                                                                                                     },
                                                                                                     "required": ["url"]

                                                                                                     }
                                                                                           },
                                                                                "media": {"type": "array",
                                                                                          "items": {"type": "object",
                                                                                                    "properties": {
                                                                                                        "mimetype": {
                                                                                                            "type": "string",
                                                                                                            "pattern": "^(?!\s*$).+"},
                                                                                                        "url": {
                                                                                                            "type": "string",
                                                                                                            "pattern": "^(?!\s*$).+"}
                                                                                                    }
                                                                                                    }
                                                                                          },
                                                                            }
                                                                            },
                                                             "time": {"type": "object",
                                                                      "properties": {
                                                                          "label": {"type": "string"},
                                                                          "range": {"type": "object",
                                                                                    "properties": {
                                                                                        "start": {"type": "string"},
                                                                                        "end": {"type": "string"}
                                                                                    }
                                                                                    },
                                                                      }
                                                                      },
                                                             "item_ids": {"type": "array",
                                                                             "items": {
                                                                                 "type": "string",
                                                                                 "pattern": "^(?!\s*$).+"}},
                                                             "category_ids": {"type": "array",
                                                                             "items": {
                                                                                 "type": "string",
                                                                                 "pattern": "^(?!\s*$).+"}},
                                                             "location_ids": {"type": "array",
                                                                             "items": {
                                                                                 "type": "string",
                                                                                 "pattern": "^(?!\s*$).+"}},
                                                         }
                                                         }
                                               },

                                },

                                }
                      },

    },
    "required": ["fulfillments", "payments", "descriptor", "providers"]

}
