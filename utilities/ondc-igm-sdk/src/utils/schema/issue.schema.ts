import Joi from 'joi';

const issueSchema = Joi.object({
  context: Joi.object({
    domain: Joi.string().required().messages({
      'string.base': 'Context: Domain must be a string.',
      'any.required': 'Context: Domain is required.',
    }),
    country: Joi.string().required().messages({
      'string.base': 'Context: Country must be a string.',
      'any.required': 'Context: Country is required.',
    }),
    city: Joi.string().required().messages({
      'string.base': 'Context: City must be a string.',
      'any.required': 'Context: City is required.',
    }),
    action: Joi.string().required().messages({
      'string.base': 'Context: Action must be a string.',
      'any.required': 'Context: Action is required.',
    }),
    core_version: Joi.string().required().messages({
      'string.base': 'Context: Core version must be a string.',
      'any.required': 'Context: Core version is required.',
    }),
    bap_id: Joi.string().required().messages({
      'string.base': 'Context: Bap ID must be a string.',
      'any.required': 'Context: Bap ID is required.',
    }),
    bap_uri: Joi.string().required().messages({
      'string.base': 'Context: Bap URI must be a string.',
      'string.uri': 'Context: Bap URI must be a valid URI.',
      'any.required': 'Context: Bap URI is required.',
    }),
    bpp_id: Joi.string().required().messages({
      'string.base': 'Context: Bpp ID must be a string.',
      'any.required': 'Context: Bpp ID is required.',
    }),
    bpp_uri: Joi.string().required().messages({
      'string.base': 'Context: Bpp URI must be a string.',
      'string.uri': 'Context: Bpp URI must be a valid URI.',
      'any.required': 'Context: Bpp URI is required.',
    }),
    transaction_id: Joi.string().required().messages({
      'string.base': 'Context: Transaction ID must be a string.',
      'any.required': 'Context: Transaction ID is required.',
    }),
    message_id: Joi.string().required().messages({
      'string.base': 'Context: Message ID must be a string.',
      'any.required': 'Context: Message ID is required.',
    }),
    timestamp: Joi.string().isoDate().required().messages({
      'string.base': 'Context: Timestamp must be a valid ISO date string.',
      'string.isoDate': 'Context: Timestamp must be a valid ISO date string.',
      'any.required': 'Context: Timestamp is required.',
    }),
    ttl: Joi.string().required().messages({
      'string.base': 'Context: TTL must be a string.',
      'any.required': 'Context: TTL is required.',
    }),
  })
    .required()
    .messages({
      'any.required': 'Context is required.',
    }),

  message: Joi.object({
    issue: Joi.object({
      id: Joi.string().required().messages({
        'string.base': 'Issue: ID must be a string.',
        'any.required': 'Issue: ID is required.',
      }),
      category: Joi.string().required().messages({
        'string.base': 'Issue: Category must be a string.',
        'any.required': 'Issue: Category is required.',
      }),
      sub_category: Joi.string().required().messages({
        'string.base': 'Issue: Sub-category must be a string.',
        'any.required': 'Issue: Sub-category is required.',
      }),
      complainant_info: Joi.object({
        person: Joi.object({
          name: Joi.string().required().messages({
            'string.base': 'Complainant: Name must be a string.',
            'any.required': 'Complainant: Name is required.',
          }),
        }).required(),
        contact: Joi.object({
          phone: Joi.string().required().messages({
            'string.base': 'Complainant: Phone must be a string.',
            'any.required': 'Complainant: Phone is required.',
          }),
          email: Joi.string().email().required().messages({
            'string.base': 'Complainant: Email must be a string.',
            'string.email': 'Complainant: Email must be a valid email address.',
            'any.required': 'Complainant: Email is required.',
          }),
        }).required(),
      }).required(),
      order_details: Joi.object({
        id: Joi.string().uuid().required().messages({
          'string.base': 'Order Details: ID must be a string.',
          'string.uuid': 'Order Details: ID must be a valid UUID.',
          'any.required': 'Order Details: ID is required.',
        }),
        state: Joi.string().required().messages({
          'string.base': 'Order Details: State must be a string.',
          'any.required': 'Order Details: State is required.',
        }),
        items: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required().messages({
                'string.base': 'Order Item: ID must be a string.',
                'any.required': 'Order Item: ID is required.',
              }),
              quantity: Joi.number().integer().required().messages({
                'number.base': 'Order Item: Quantity must be a number.',
                'number.integer': 'Order Item: Quantity must be an integer.',
                'any.required': 'Order Item: Quantity is required.',
              }),
            }),
          )
          .required(),
        fulfillments: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required().messages({
                'string.base': 'Fulfillment: ID must be a string.',
                'any.required': 'Fulfillment: ID is required.',
              }),
              state: Joi.string().required().messages({
                'string.base': 'Fulfillment: State must be a string.',
                'any.required': 'Fulfillment: State is required.',
              }),
            }),
          )
          .required(),
        provider_id: Joi.string().required().messages({
          'string.base': 'Order Details: Provider ID must be a string.',
          'any.required': 'Order Details: Provider ID is required.',
        }),
      }).required(),
      description: Joi.object({
        short_desc: Joi.string().required().messages({
          'string.base': 'Description: Short description must be a string.',
          'any.required': 'Description: Short description is required.',
        }),
        long_desc: Joi.string().required().messages({
          'string.base': 'Description: Long description must be a string.',
          'any.required': 'Description: Long description is required.',
        }),
        additional_desc: Joi.object({
          url: Joi.string().required().messages({
            'string.base': 'Additional Description: URL must be a string.',
            'string.uri': 'Additional Description: URL must be a valid URI.',
            'any.required': 'Additional Description: URL is required.',
          }),
          content_type: Joi.string().required().messages({
            'string.base': 'Additional Description: Content type must be a string.',
            'any.required': 'Additional Description: Content type is required.',
          }),
        }).required(),
        images: Joi.array().items(Joi.string()).required().messages({
          'array.base': 'Images must be an array.',
          'any.required': 'Images is required.',
          'string.uri': 'Each image must be a valid URI.',
        }),
      }).required(),
      source: Joi.object({
        network_participant_id: Joi.string().required().messages({
          'string.base': 'Source: Network participant ID must be a string.',
          'any.required': 'Source: Network participant ID is required.',
        }),
        type: Joi.string().required().messages({
          'string.base': 'Source: Type must be a string.',
          'any.required': 'Source: Type is required.',
        }),
      }).required(),
      expected_response_time: Joi.object({
        duration: Joi.string().required().messages({
          'string.base': 'Expected Response Time: Duration must be a string.',
          'any.required': 'Expected Response Time: Duration is required.',
        }),
      }).required(),
      expected_resolution_time: Joi.object({
        duration: Joi.string().required().messages({
          'string.base': 'Expected Resolution Time: Duration must be a string.',
          'any.required': 'Expected Resolution Time: Duration is required.',
        }),
      }).required(),
      status: Joi.string().required().messages({
        'string.base': 'Status must be a string.',
        'any.required': 'Status is required.',
      }),
      issue_type: Joi.string().required().messages({
        'string.base': 'Issue Type must be a string.',
        'any.required': 'Issue Type is required.',
      }),
      issue_actions: Joi.object({
        complainant_actions: Joi.array()
          .items(
            Joi.object({
              complainant_action: Joi.string().required().messages({
                'string.base': 'Complainant Action must be a string.',
                'any.required': 'Complainant Action is required.',
              }),
              short_desc: Joi.string().required().messages({
                'string.base': 'Complainant Action: Short description must be a string.',
                'any.required': 'Complainant Action: Short description is required.',
              }),
              updated_at: Joi.string().isoDate().required().messages({
                'string.base': 'Complainant Action: Updated at must be a valid ISO date string.',
                'string.isoDate': 'Complainant Action: Updated at must be a valid ISO date string.',
                'any.required': 'Complainant Action: Updated at is required.',
              }),
              updated_by: Joi.object({
                org: Joi.object({
                  name: Joi.string().required().messages({
                    'string.base': 'Updated By: Organization name must be a string.',
                    'any.required': 'Updated By: Organization name is required.',
                  }),
                }).required(),
                contact: Joi.object({
                  phone: Joi.string().required().messages({
                    'string.base': 'Updated By: Contact phone must be a string.',
                    'any.required': 'Updated By: Contact phone is required.',
                  }),
                  email: Joi.string().email().required().messages({
                    'string.base': 'Updated By: Contact email must be a string.',
                    'string.email': 'Updated By: Contact email must be a valid email address.',
                    'any.required': 'Updated By: Contact email is required.',
                  }),
                }).required(),
                person: Joi.object({
                  name: Joi.string().required().messages({
                    'string.base': 'Updated By: Person name must be a string.',
                    'any.required': 'Updated By: Person name is required.',
                  }),
                }).required(),
              }).required(),
            }),
          )
          .required(),
      }).required(),
      created_at: Joi.string().isoDate().required().messages({
        'string.base': 'Created at must be a valid ISO date string.',
        'string.isoDate': 'Created at must be a valid ISO date string.',
        'any.required': 'Created at is required.',
      }),
      updated_at: Joi.string().isoDate().required().messages({
        'string.base': 'Updated at must be a valid ISO date string.',
        'string.isoDate': 'Updated at must be a valid ISO date string.',
        'any.required': 'Updated at is required.',
      }),
    }).required(),
  })
    .required()
    .messages({
      'any.required': 'Message is required.',
    }),
});

export default issueSchema;
