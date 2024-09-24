import Joi from 'joi';

const customMessages = {
  'string.base': '{#label} should be a type of text',
  'string.empty': '{#label} cannot be empty',
  'any.required': '{#label} is required',
  'string.email': '{#label} must be a valid email',
  'string.phone': '{#label} must be a valid phone number',
  'string.uri': '{#label} must be a valid URI',
  'string.isoDate': '{#label} must be a valid ISO date',
  'number.base': '{#label} should be a type of number',
  'number.integer': '{#label} must be an integer',
};

export const OnIssueStatusScehma = Joi.object({
  context: Joi.object({
    domain: Joi.string().required().messages(customMessages),
    country: Joi.string().required().messages(customMessages),
    city: Joi.string().required().messages(customMessages),
    action: Joi.string().required().messages(customMessages),
    core_version: Joi.string().required().messages(customMessages),
    bap_id: Joi.string().required().messages(customMessages),
    bap_uri: Joi.string().required().messages(customMessages),
    bpp_id: Joi.string().required().messages(customMessages),
    bpp_uri: Joi.string().required().messages(customMessages),
    transaction_id: Joi.string().required().messages(customMessages),
    message_id: Joi.string().required().messages(customMessages),
    timestamp: Joi.string().isoDate().required().messages(customMessages),
  }).required(),

  message: Joi.object({
    issue: Joi.object({
      id: Joi.string().required().messages(customMessages),
      issue_actions: Joi.object({
        respondent_actions: Joi.array()
          .items(
            Joi.object({
              respondent_action: Joi.string().required().messages(customMessages),
              short_desc: Joi.string().required().messages(customMessages),
              updated_at: Joi.string().isoDate().required().messages(customMessages),
              updated_by: Joi.object({
                org: Joi.object({
                  name: Joi.string().required().messages(customMessages),
                }).required(),
                contact: Joi.object({
                  phone: Joi.string()
                    .pattern(/^[0-9]{10}$/)
                    .required()
                    .messages(customMessages),
                  email: Joi.string().email().required().messages(customMessages),
                }).required(),
                person: Joi.object({
                  name: Joi.string().required().messages(customMessages),
                }).required(),
              }).required(),
              cascaded_level: Joi.number().integer().required().messages(customMessages),
            }),
          )
          .required(),
      }).required(),
      created_at: Joi.string().isoDate().required().messages(customMessages),
      updated_at: Joi.string().isoDate().required().messages(customMessages),
    }).required(),
  }).required(),
});

export const OnIssueStatusResolovedSchema = Joi.object({
  context: Joi.object({
    domain: Joi.string().required().messages(customMessages),
    country: Joi.string().required().messages(customMessages),
    city: Joi.string().required().messages(customMessages),
    action: Joi.string().required().messages(customMessages),
    core_version: Joi.string().required().messages(customMessages),
    bap_id: Joi.string().required().messages(customMessages),
    bap_uri: Joi.string().required().messages(customMessages),
    bpp_id: Joi.string().required().messages(customMessages),
    bpp_uri: Joi.string().required().messages(customMessages),
    transaction_id: Joi.string().required().messages(customMessages),
    message_id: Joi.string().required().messages(customMessages),
    timestamp: Joi.string().isoDate().required().messages(customMessages),
  }).required(),

  message: Joi.object({
    issue: Joi.object({
      id: Joi.string().required().messages(customMessages),
      issue_actions: Joi.object({
        respondent_actions: Joi.array()
          .items(
            Joi.object({
              respondent_action: Joi.string().required().messages(customMessages),
              short_desc: Joi.string().required().messages(customMessages),
              updated_at: Joi.string().isoDate().required().messages(customMessages),
              updated_by: Joi.object({
                org: Joi.object({
                  name: Joi.string().required().messages(customMessages),
                }).required(),
                contact: Joi.object({
                  phone: Joi.string()
                    .pattern(/^[0-9]{10}$/)
                    .required()
                    .messages(customMessages),
                  email: Joi.string().email().required().messages(customMessages),
                }).required(),
                person: Joi.object({
                  name: Joi.string().required().messages(customMessages),
                }).required(),
              }).required(),
              cascaded_level: Joi.number().integer().required().messages(customMessages),
            }),
          )
          .required(),
      }).required(),
      created_at: Joi.string().isoDate().required().messages(customMessages),
      updated_at: Joi.string().isoDate().required().messages(customMessages),
      resolution_provider: Joi.object({
        respondent_info: Joi.object({
          type: Joi.string().required().messages(customMessages),
          organization: Joi.object({
            org: Joi.object({
              name: Joi.string().required().messages(customMessages),
            }).required(),
            contact: Joi.object({
              phone: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .required()
                .messages(customMessages),
              email: Joi.string().email().required().messages(customMessages),
            }).required(),
            person: Joi.object({
              name: Joi.string().required().messages(customMessages),
            }).required(),
          }).required(),
          resolution_support: Joi.object({
            chat_link: Joi.string().required().messages(customMessages),
            contact: Joi.object({
              phone: Joi.string()
                .pattern(/^[0-9]{10}$/)
                .required()
                .messages(customMessages),
              email: Joi.string().email().required().messages(customMessages),
            }).required(),
            gros: Joi.array()
              .items(
                Joi.object({
                  person: Joi.object({
                    name: Joi.string().required().messages(customMessages),
                  }).required(),
                  contact: Joi.object({
                    phone: Joi.string()
                      .pattern(/^[0-9]{10}$/)
                      .required()
                      .messages(customMessages),
                    email: Joi.string().email().required().messages(customMessages),
                  }).required(),
                  gro_type: Joi.string().required().messages(customMessages),
                }),
              )
              .required(),
          }).required(),
        }).required(),
      }).required(),
      resolution: Joi.object({
        short_desc: Joi.string().required().messages(customMessages),
        long_desc: Joi.string().required().messages(customMessages),
        action_triggered: Joi.string().required().messages(customMessages),
        refund_amount: Joi.number().required().messages(customMessages),
      }).required(),
    }).required(),
  }).required(),
});
