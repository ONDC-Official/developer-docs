import Joi from 'joi';

const LogisticsIssueSchema = Joi.object({
  context: Joi.object({
    domain: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    action: Joi.string().required(),
    core_version: Joi.string().required(),
    bap_id: Joi.string().required(),
    bap_uri: Joi.string().required(),
    bpp_id: Joi.string().required(),
    bpp_uri: Joi.string().required(),
    transaction_id: Joi.string().required(),
    message_id: Joi.string().required(),
    timestamp: Joi.string().isoDate().required(),
    ttl: Joi.string().required(),
  }).required(),

  message: Joi.object({
    issue: Joi.object({
      id: Joi.string().required(),
      category: Joi.string().required(),
      sub_category: Joi.string().required(),
      complainant_info: Joi.object({
        person: Joi.object({
          name: Joi.string().required(),
        }).required(),
        contact: Joi.object({
          phone: Joi.string().required(),
          email: Joi.string().email().required(),
        }).required(),
      }).required(),

      order_details: Joi.object({
        id: Joi.string().uuid().required(),
        state: Joi.string().required(),
        items: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required(),
              quantity: Joi.number().required(),
            }),
          )
          .required(),
        fulfillments: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required(),
              state: Joi.string().required(),
            }),
          )
          .required(),
        provider_id: Joi.string().required(),
        merchant_order_id: Joi.string(),
      }).required(),

      description: Joi.object({
        short_desc: Joi.string().required(),
        long_desc: Joi.string().required(),
        additional_desc: Joi.object({
          url: Joi.string().required(),
          content_type: Joi.string().required(),
        }).required(),
        images: Joi.array().items(Joi.string()).required(),
      }).required(),

      source: Joi.object({
        network_participant_id: Joi.string().required(),
        type: Joi.string().required(),
      }).required(),

      expected_response_time: Joi.object({
        duration: Joi.string().required(),
      }).required(),

      expected_resolution_time: Joi.object({
        duration: Joi.string().required(),
      }).required(),

      status: Joi.string().required(),
      issue_type: Joi.string().required(),

      issue_actions: Joi.object({
        complainant_actions: Joi.array()
          .items(
            Joi.object({
              complainant_action: Joi.string().required(),
              short_desc: Joi.string().required(),
              updated_at: Joi.string().isoDate().required(),
              updated_by: Joi.object({
                org: Joi.object({
                  name: Joi.string().required(),
                }).required(),
                contact: Joi.object({
                  phone: Joi.string().required(),
                  email: Joi.string().email().required(),
                }).required(),
                person: Joi.object({
                  name: Joi.string().required(),
                }).required(),
              }).required(),
            }),
          )
          .required(),

        respondent_actions: Joi.array()
          .items(
            Joi.object({
              respondent_action: Joi.string().required(),
              short_desc: Joi.string().required(),
              updated_at: Joi.string().isoDate().required(),
              updated_by: Joi.object({
                org: Joi.object({
                  name: Joi.string().required(),
                }).required(),
                contact: Joi.object({
                  phone: Joi.string().required(),
                  email: Joi.string().email().required(),
                }).required(),
                person: Joi.object({
                  name: Joi.string().required(),
                }).required(),
              }).required(),
              cascaded_level: Joi.number().required(),
            }),
          )
          .required(),
      }).required(),

      created_at: Joi.string().isoDate().required(),
      updated_at: Joi.string().isoDate().required(),
    }).required(),
  }).required(),
});

export default LogisticsIssueSchema;
